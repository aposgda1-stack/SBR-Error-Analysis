import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("sbr_error_analysis");

    const topUsers = await db.collection("progress").aggregate([
      { $sort: { xp: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: 1,
          name: "$userDetails.name",
          image: "$userDetails.image",
          xp: 1,
          level: 1
        }
      }
    ]).toArray();

    return NextResponse.json({ leaderboard: topUsers });
  } catch (err) {
    console.error("Leaderboard API Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
