export async function archiveGameAction(gameId: string) {
  const gameAnswers = await db.query.answers.findMany({ where: eq(answers.gameId, gameId) });
  
  // Logic to find the most matched word...
  // Then insert into gameMetadata
  await db.insert(gameMetadata).values({
    gameId,
    mostMatchedWord: "Example", // Result of your logic
    matchCount: 5,
    totalPlayers: 4,
  });
}
