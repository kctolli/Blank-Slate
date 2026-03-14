"use server"

import { db } from "@/db";
import { players, answers, games, gameMetadata } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function archiveGameAction(gameId: string) {
  try {
    // 1. Fetch all answers and players for this game
    const gameAnswers = await db.query.answers.findMany({ 
      where: eq(answers.gameId, gameId) 
    });
    
    const gamePlayers = await db.query.players.findMany({ 
      where: eq(players.gameId, gameId) 
    });

    if (gameAnswers.length === 0) return;

    // 2. Logic: Find the most matched word
    // We group by word and count occurrences
    const wordCounts: Record<string, number> = {};
    gameAnswers.forEach((a) => {
      const word = a.word.toUpperCase().trim();
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const [mostMatchedWord, matchCount] = Object.entries(wordCounts).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      ["None", 0]
    );

    // 3. Logic: Find the highest winning score
    const winningScore = Math.max(...gamePlayers.map(p => p.score || 0));

    // 4. Insert into Hall of Fame (Metadata)
    await db.insert(gameMetadata).values({
      gameId,
      mostMatchedWord,
      matchCount,
      winningScore,
      totalPlayers: gamePlayers.length,
    });

    // 5. Update game status to 'finished'
    await db.update(games)
      .set({ status: "finished" })
      .where(eq(games.id, gameId));

    console.log(`Successfully archived game: ${gameId}`);
  } catch (error) {
    console.error("Archive Error:", error);
  }
}