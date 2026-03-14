"use server"

import { db } from "@/db";
import { games, prompts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function nextRoundAction(gameId: string) {
  // Pick a NEW random prompt for the next round
  const nextPrompt = await db
    .select()
    .from(prompts)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  await db.update(games)
    .set({ 
      currentPromptId: nextPrompt[0].id,
      status: "playing" // Reset status if it was in 'scoring'
    })
    .where(eq(games.id, gameId));

  revalidatePath(`/game/${gameId}`);
}