"use server"

import { db } from "@/db";
import { answers, players } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitAnswerAction(
  gameId: string,
  playerId: number,
  roundNumber: number,
  word: string
) {
  try {
    // 1. Insert the answer (normalized to lowercase)
    await db.insert(answers).values({
      gameId,
      playerId,
      roundNumber,
      word: word.trim().toLowerCase(),
    });

    // 2. Check if all players in this game have submitted for this round
    const totalPlayersResult = await db
      .select({ value: count() })
      .from(players)
      .where(eq(players.gameId, gameId));

    const totalAnswersResult = await db
      .select({ value: count() })
      .from(answers)
      .where(
        and(
          eq(answers.gameId, gameId),
          eq(answers.roundNumber, roundNumber)
        )
      );

    const totalPlayers = totalPlayersResult[0].value;
    const totalAnswers = totalAnswersResult[0].value;

    // 3. If everyone is done, we can update the game status or trigger scoring
    if (totalAnswers >= totalPlayers) {
      // Logic for "Round Complete" could go here
      // e.g., await db.update(games).set({ status: 'scoring' }).where(eq(games.id, gameId));
    }

    // 4. Refresh the UI so the "Waiting for others..." state updates
    revalidatePath(`/game/${gameId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to submit answer:", error);
    return { success: false, error: "Could not save answer." };
  }
}