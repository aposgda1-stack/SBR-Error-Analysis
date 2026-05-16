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
      const { userId, progress, xp, level, incXp, incDone, pushVault, pushHistory } = data;
      if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

      const update = { $set: { updatedAt: new Date() } };
      if (progress) update.$set.progress = progress;
      if (xp !== undefined) update.$set.xp = xp;
      if (level !== undefined) update.$set.level = level;

      const inc = {};
      if (incXp !== undefined) inc.xp = incXp;
      if (incDone !== undefined) inc.done = incDone;

      const push = {};
      if (pushVault) push.vault = pushVault;
      if (pushHistory) push.history = pushHistory;

      const updateOp = { ...update };
      if (Object.keys(inc).length > 0) updateOp.$inc = inc;
      if (Object.keys(push).length > 0) updateOp.$push = push;

      await db.collection("progress").updateOne(
        { userId },
        updateOp,
        { upsert: true }
      );

      return NextResponse.json({ success: true });
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
        rank
      }
    });
  } catch (err) {
    console.error("API GET Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
