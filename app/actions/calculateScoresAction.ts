"use server"

import { db } from "@/db";
import { players, answers, games } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function calculateScoresAction(gameId: string, roundNumber: number) {
  try {
    // 1. Fetch all answers for this specific round
    const roundAnswers = await db.query.answers.findMany({
      where: and(
        eq(answers.gameId, gameId),
        eq(answers.roundNumber, roundNumber)
      ),
    });

    if (roundAnswers.length === 0) return { success: false, message: "No answers found" };

    // 2. Group answers by word (case-insensitive) to find matches
    const wordGroups: Record<string, number[]> = {};
    
    roundAnswers.forEach((ans) => {
      const normalizedWord = ans.word.trim().toLowerCase();
      if (!wordGroups[normalizedWord]) {
        wordGroups[normalizedWord] = [];
      }
      wordGroups[normalizedWord].push(ans.playerId);
    });

    // 3. Determine points for each player
    const playerPointUpdates: Record<number, number> = {};

    for (const word in wordGroups) {
      const playerIds = wordGroups[word];
      let pointsToAdd = 0;

      if (playerIds.length === 2) {
        pointsToAdd = 3; // The "Golden Match"
      } else if (playerIds.length > 2) {
        pointsToAdd = 1; // The "Common Match"
      }

      if (pointsToAdd > 0) {
        playerIds.forEach(id => {
          playerPointUpdates[id] = pointsToAdd;
        });
      }
    }

    // 4. Batch update player scores in the database
    // We use a transaction to ensure all scores update or none do
    await db.transaction(async (tx) => {
      for (const [playerId, points] of Object.entries(playerPointUpdates)) {
        await tx.update(players)
          .set({
            score: sql`${players.score} + ${points}`
          })
          .where(eq(players.id, parseInt(playerId)));
      }
      
      // Update game status to show we are in the "scoring/results" phase
      await tx.update(games)
        .set({ status: 'scoring' })
        .where(eq(games.id, gameId));
    });

    revalidatePath(`/game/${gameId}`);
    return { success: true };

  } catch (error) {
    console.error("Score calculation failed:", error);
    return { success: false, error: "Failed to update scores" };
  }
}