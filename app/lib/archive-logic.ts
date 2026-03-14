import { db } from "@/db";
import { answers, players, gameMetadata } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function archiveGameStats(gameId: string) {
  // 1. Fetch all players and all answers for this game
  const gamePlayers = await db.query.players.findMany({ where: eq(players.gameId, gameId) });
  const gameAnswers = await db.query.answers.findMany({ where: eq(answers.gameId, gameId) });

  if (gameAnswers.length === 0) return;

  // 2. Find Most Matched Word
  const wordCounts: Record<string, number> = {};
  gameAnswers.forEach(a => {
    const word = a.word.trim().toLowerCase();
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  const mostMatched = Object.entries(wordCounts).sort((a, b) => b[1] - a[1])[0];

  // 3. Find Most Compatible Pair (Optional MBA "Fun Fact")
  // We look for the two player IDs that appear together on the same word/round most often
  const pairMatches: Record<string, number> = {};
  const rounds = [...new Set(gameAnswers.map(a => a.roundNumber))];

  rounds.forEach(r => {
    const roundAns = gameAnswers.filter(a => a.roundNumber === r);
    const groups: Record<string, number[]> = {};
    
    roundAns.forEach(a => {
        const w = a.word.trim().toLowerCase();
        if (!groups[w]) groups[w] = [];
        groups[w].push(a.playerId);
    });

    Object.values(groups).forEach(ids => {
        if (ids.length >= 2) {
            ids.sort().forEach((id1, i) => {
                ids.slice(i + 1).forEach(id2 => {
                    const pair = `${id1}-${id2}`;
                    pairMatches[pair] = (pairMatches[pair] || 0) + 1;
                });
            });
        }
    });
  });

  const topPair = Object.entries(pairMatches).sort((a, b) => b[1] - a[1])[0];

  // 4. Save to Metadata
  await db.insert(gameMetadata).values({
    gameId,
    totalPlayers: gamePlayers.length,
    mostMatchedWord: mostMatched[0],
    matchCount: mostMatched[1],
    // You could add a 'topPair' column to your schema if you want to save that too!
    totalRounds: rounds.length,
  });
}
