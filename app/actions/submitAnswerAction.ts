"use server";

import { db } from "@/db";
import { answers, players, games } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { calculateScoresAction } from "./calculateScoresAction"; 

export async function submitAnswerAction(
  gameId: string,
  playerId: number,
  roundNumber: number,
  word: string
) {
  try {
    // 1. Insert the answer
    await db.insert(answers).values({
      gameId,
      playerId,
      roundNumber,
      word: word.trim().toLowerCase(),
    });

    // 2. Fetch the game and current player count in one go
    // Using the relational query we fixed earlier!
    const gameData = await db.query.games.findFirst({
      where: eq(games.id, gameId),
      with: { players: true }
    });

    if (!gameData) throw new Error("Game not found");

    // 3. Check total answers for THIS round using SQL count for efficiency
    const answerCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(answers)
      .where(
        and(
          eq(answers.gameId, gameId),
          eq(answers.roundNumber, roundNumber)
        )
      );

    const totalAnswers = Number(answerCountResult[0].count);
    const totalPlayers = gameData.players.length;

    // 4. If everyone is in, trigger the logic for the next phase
    if (totalAnswers >= totalPlayers) {
      console.log(`Round ${roundNumber} complete for game ${gameId}. Calculating scores...`);
      
      // Trigger your scoring logic here
      await calculateScoresAction(gameId, roundNumber);
      
      // Optionally update game status to 'scoring' or 'results'
      await db.update(games).set({ status: 'playing' }).where(eq(games.id, gameId));
    }

    // 5. Refresh the page so the submitting player sees the "Waiting" state
    revalidatePath(`/game/${gameId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to submit answer:", error);
    return { success: false, error: "Could not save answer." };
  }
}