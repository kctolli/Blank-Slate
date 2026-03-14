"use server" // MUST be at the top

import { db } from "@/db";
import { games, prompts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Ensure this name matches EXACTLY what you import
export async function startGameAction(gameId: string) {
  try {
    // Fetch the players for this game
    const allPlayers = await db.query.players.findMany({
      where: eq(players.gameId, gameId),
      orderBy: (players, { asc }) => [asc(players.id)],
    });

    // Verify the person calling the action is the first player in the list
    if (allPlayers[0].id !== requestPlayerId) {
      throw new Error("Unauthorized: Only the host can start the game.");
    }

    // 1. Pick a random starting prompt
    const firstPrompt = await db.query.prompts.findFirst({
      orderBy: sql`RANDOM()`,
    });

    if (!firstPrompt) throw new Error("No prompts found");

    // 2. Update the game to 'playing'
    await db.update(games)
      .set({
        status: "playing",
        currentPromptId: firstPrompt.id,
        roundNumber: 1,
      })
      .where(eq(games.id, gameId));

    // 3. Refresh the UI
    revalidatePath(`/game/${gameId}`);
  } catch (error) {
    console.error("Failed to start game:", error);
  }
}