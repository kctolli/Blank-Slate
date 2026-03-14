"use server"

import { db } from "@/db";
import { players, games } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function leaveGameAction(gameId: string, playerId: number) {
  // 1. Remove the player
  await db.delete(players).where(eq(players.id, playerId));

  // 2. Check if any players are left
  const remaining = await db.select({ value: count() })
    .from(players)
    .where(eq(players.gameId, gameId));

  // 3. If room is empty, delete the game record to save Neon storage
  if (remaining[0].value === 0) {
    await db.delete(games).where(eq(games.id, gameId));
  }

  redirect("/");
}
