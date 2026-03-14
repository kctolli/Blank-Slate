import { db } from "@/db";
import { games } from "@/db/schema";
import { lt, and, or, eq } from "drizzle-orm";
import { archiveGameStats } from "@/lib/archive-logic";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Security: Check if the request is actually from Vercel
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const statePending = await pendingStatus();
  const stateAll = await allStatus();  
  return statePending && stateAll;
}


const pendingStatus = async () => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    // 1. Identify the games about to be deleted
    const staleGames = await db.query.games.findMany({
      where: and(
          lt(games.createdAt, oneDayAgo),
          or(eq(games.status, 'waiting'), eq(games.status, 'finished'))
      )
    });

    // 2. Archive each one
    for (const game of staleGames) {
      await archiveGameStats(game.id);
    }

    // 3. Now perform the deletion (Cascade will handle players/answers)
    await db.delete(games).where(
      and(
          lt(games.createdAt, oneDayAgo),
          or(eq(games.status, 'waiting'), eq(games.status, 'finished'))
      )
    );
    return NextResponse.json({
      success: true,
      count: deletedGames.length,
      message: `Cleaned up ${deletedGames.length} stale lobbies.`
    });
  } catch (error) {
    console.error("Cleanup Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

const allStatus = async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 2. Delete old games 
    // (If your schema has 'onDelete: cascade', this will automatically 
    // remove the players and answers associated with these games!)
    const deletedGames = await db.delete(games)
      .where(lt(games.createdAt, oneWeekAgo))
      .returning();

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deletedGames.length} stale games.`,
    });
  } catch (error) {
    console.error("Cleanup failed:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
