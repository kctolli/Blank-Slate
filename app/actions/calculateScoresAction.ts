"use server"

import { db } from "@/db";
import { answers, players } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function calculateScoresAction(gameId: string, round: number) {
  // 1. Get all answers for this round
  const allAnswers = await db.select().from(answers).where(
    and(eq(answers.gameId, gameId), eq(answers.roundNumber, round))
  );

  // 2. Group answers by word to find matches
  const wordCounts: Record<string, number[]> = {};
  allAnswers.forEach(ans => {
    const word = ans.word.toLowerCase().trim();
    if (!wordCounts[word]) wordCounts[word] = [];
    wordCounts[word].push(ans.playerId);
  });

  // 3. Apply Blank Slate Scoring Rules
  for (const playerIds of Object.values(wordCounts)) {
    let points = 0;
    
    if (playerIds.length === 2) {
        points = 3; 
    } else if (playerIds.length > 2) {
        points = 1;
    }

    if (points > 0) {
        for (const pid of playerIds) {
        await db.update(players)
            .set({ score: sql`${players.score} + ${points}` })
            .where(eq(players.id, pid));
        }
    }
  }
}
