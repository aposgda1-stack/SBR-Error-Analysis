import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("sbr_error_analysis");
    const data = await req.json();

    if (data.action === 'signup') {
      const { name, email, password, image } = data;
      const existing = await db.collection("users").findOne({ email });
      if (existing) return NextResponse.json({ error: 'User exists' }, { status: 400 });

      const userId = 'user_' + Math.random().toString(36).substr(2, 9);
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        userId, name, email, password: hashedPassword, createdAt: new Date(),
        image: image || null
      };

      await db.collection("users").insertOne(user);
      return NextResponse.json({ success: true, userId, name, image: user.image });
    }

    if (data.action === 'login') {
      const { email, password } = data;
      const user = await db.collection("users").findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      return NextResponse.json({
        success: true,
        userId: user.userId,
        name: user.name,
        image: user.image
      });
    }

    if (data.action === 'sync') {
      const { userId, progress, xp, level, incXp, incDone, pushVault, pushHistory, clearNotification } = data;
      if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
 
      // Security: verify user exists
      const userExists = await db.collection("users").findOne({ userId });
      if (!userExists) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      const update = { $set: { updatedAt: new Date() } };
      if (progress) update.$set.progress = progress;
      if (xp !== undefined) update.$set.xp = xp;
      if (level !== undefined) update.$set.level = level;
      if (clearNotification) {
        update.$set['notification.show'] = false;
        await db.collection("users").updateOne({ userId }, { $set: { "notification.show": false } });
      }

      const inc = {};
      let finalIncXp = incXp;

      // Anti-cheat/tampering guard: Verify that exam and comprehensive guide points are only awarded once
      if (pushHistory && (pushHistory.type === 'Final Exam' || pushHistory.type === 'Midterm Exam' || pushHistory.type === 'Comprehensive Study Guide' || pushHistory.type === 'Comprehensive Error Hunter')) {
        const currentProgress = await db.collection("progress").findOne({ userId });
        const alreadyTaken = currentProgress?.history?.some(h => h.type === pushHistory.type);
        if (alreadyTaken) {
          finalIncXp = 0;
        }
      }

      // Guard: only add positive XP
      if (finalIncXp !== undefined && finalIncXp > 0) inc.xp = finalIncXp;
      if (incDone !== undefined && incDone > 0) inc.done = incDone;

      const push = {};
      // pushVault expects { $each: [...] } already or a single item
      if (pushVault) {
        const items = pushVault.$each ? pushVault.$each : [pushVault];
        // Deduplicate incoming items by ID
        const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
        
        // Remove existing items with these IDs first to prevent duplicates
        const itemIds = uniqueItems.map(i => i.id);
        if (itemIds.length > 0) {
          await db.collection("progress").updateOne(
            { userId },
            { $pull: { vault: { id: { $in: itemIds } } } }
          );
        }
        push.vault = { $each: uniqueItems };
      }
      // pushHistory is always a single history item object
      if (pushHistory && typeof pushHistory === 'object') {
        push.history = { $each: [{ ...pushHistory, date: new Date() }] };
      }

      const updateOp = { ...update };
      if (Object.keys(inc).length > 0) updateOp.$inc = inc;
      if (Object.keys(push).length > 0) updateOp.$push = push;

      await db.collection("progress").updateOne(
        { userId },
        updateOp,
        { upsert: true }
      );

      // --- Achievements check (server-side, non-blocking) ---
      const prog = await db.collection("progress").findOne({ userId });
      const currentXp = prog?.xp || 0;
      const currentDone = prog?.done || 0;
      const earnedBadges = prog?.badges || [];
      const newBadges = [...earnedBadges];

      if (currentDone >= 1 && !newBadges.includes('first_steps')) newBadges.push('first_steps');
      if (currentDone >= 10 && !newBadges.includes('consistent')) newBadges.push('consistent');
      if (currentXp >= 500 && !newBadges.includes('elite_scholar')) newBadges.push('elite_scholar');

      if (newBadges.length > earnedBadges.length) {
        await db.collection("progress").updateOne({ userId }, { $set: { badges: newBadges } });
      }

      return NextResponse.json({ success: true, newBadges: newBadges.filter(b => !earnedBadges.includes(b)) });
    }

    if (data.action === 'updateProfile') {
      const { userId, name, image } = data;
      if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

      const update = {};
      if (name) update.name = name;
      if (image) update.image = image;

      await db.collection("users").updateOne({ userId }, { $set: update });
      return NextResponse.json({ success: true });
    }

    if (data.action === 'removeFromVault') {
      const { userId, itemId } = data;
      if (!userId || !itemId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

      await db.collection("progress").updateOne(
        { userId },
        { $pull: { vault: { id: itemId } } }
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("sbr_error_analysis");
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const userProgress = await db.collection("progress").findOne({ userId }) || {};
    const userBase = await db.collection("users").findOne({ userId });

    const xp = userProgress.xp || 0;
    const rank = await db.collection("progress").countDocuments({ xp: { $gt: xp } }) + 1;

    return NextResponse.json({
      user: {
        ...userProgress,
        name: userBase?.name || 'Student',
        image: userBase?.image || null,
        notification: userBase?.notification || userProgress?.notification || null,
        rank
      }
    });
  } catch (err) {
    console.error("API GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
