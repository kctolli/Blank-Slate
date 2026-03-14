import { db } from "@/db";
import { games } from "@/db/schema";
import { lt, and, or, eq } from "drizzle-orm";
import { archiveGameStats } from "@/lib/archive-logic";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Security Check
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Run both cleanup tasks
    const pendingResult = await cleanupStaleLobbies();
    const allResult = await cleanupOldGames();

    return NextResponse.json({
      success: true,
      staleLobbies: pendingResult,
      oldGames: allResult
    });
  } catch (error) {
    console.error("Global Cleanup Error:", error);
    return NextResponse.json({ success: false, error: "Cleanup failed" }, { status: 500 });
  }
}

async function cleanupStaleLobbies() {
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  // 1. Find them first so we can archive them
  const staleGames = await db.query.games.findMany({
    where: and(
      lt(games.createdAt, oneDayAgo),
      or(eq(games.status, 'waiting'), eq(games.status, 'finished'))
    )
  });

  // 2. Run your archive logic
  for (const game of staleGames) {
    await archiveGameStats(game.id);
  }

  // 3. Delete and RETURN the count
  const deleted = await db.delete(games)
    .where(
      and(
        lt(games.createdAt, oneDayAgo),
        or(eq(games.status, 'waiting'), eq(games.status, 'finished'))
      )
    )
    .returning();

  return deleted.length;
}

async function cleanupOldGames() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const deletedGames = await db.delete(games)
    .where(lt(games.createdAt, oneWeekAgo))
    .returning();

  return deletedGames.length;
}