"use server"

import { db } from "@/db";
import { games, prompts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function startGameAction(gameId: string) {
  // 1. Get a random prompt from your 500-word table
  const randomPrompt = await db
    .select()
    .from(prompts)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!randomPrompt.length) throw new Error("No prompts found in database.");

  // 2. Update game status and set the first prompt
  await db.update(games)
    .set({ 
      status: "playing",
      currentPromptId: randomPrompt[0].id 
    })
    .where(eq(games.id, gameId));

  revalidatePath(`/game/${gameId}`);
}
