"use server"

import { db } from "@/db";
import { players } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function transferHostAction(gameId: string, newHostId: number, currentHostId: number) {
  await db.transaction(async (tx) => {
    // 1. Demote current host
    await tx.update(players)
      .set({ role: "player" })
      .where(and(eq(players.id, currentHostId), eq(players.gameId, gameId)));

    // 2. Promote new host
    await tx.update(players)
      .set({ role: "host" })
      .where(and(eq(players.id, newHostId), eq(players.gameId, gameId)));
  });

  revalidatePath(`/game/${gameId}`);
}
