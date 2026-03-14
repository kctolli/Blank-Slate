"use server"

import { db } from "@/db";
import { games, prompts, answers } from "@/db/schema"; // Import answers
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Add prevState and formData to the signature
export async function nextRoundAction(gameId: string, prevState: any, formData: FormData) {
  try {
    // 1. Pick a NEW random prompt
    const nextPrompt = await db
      .select()
      .from(prompts)
      .orderBy(sql`RANDOM()`)
      .limit(1);

    if (!nextPrompt[0]) return { error: "No prompts found" };

    // 2. Clear out the previous round's answers so players can submit again!
    // If you don't do this, the 'isRoundOver' logic will keep the results visible
    await db.delete(answers).where(eq(answers.gameId, gameId));

    // 3. Update the game state
    await db.update(games)
      .set({ 
        currentPromptId: nextPrompt[0].id,
        status: "playing",
        // Increment the round number
        roundNumber: sql`${games.roundNumber} + 1` 
      })
      .where(eq(games.id, gameId));

    revalidatePath(`/game/${gameId}`);
    return { success: true };
  } catch (error) {
    console.error("Next Round Error:", error);
    return { error: "Failed to start next round" };
  }
}
