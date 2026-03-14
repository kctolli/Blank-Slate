"use server"

import { db } from "@/db";
import { games, prompts, players } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Add requestPlayerId as a second argument
export async function startGameAction(gameId: string, requestPlayerId: number) {
  try {
    const allPlayers = await db.query.players.findMany({
      where: eq(players.gameId, gameId),
      orderBy: (players, { asc }) => [asc(players.id)],
    });

    // Now requestPlayerId is defined!
    if (allPlayers.length === 0 || allPlayers[0].id !== requestPlayerId) {
      throw new Error("Unauthorized: Only the host can start the game.");
    }

    const firstPrompt = await db.query.prompts.findFirst({
      orderBy: sql`RANDOM()`,
    });

    if (!firstPrompt) throw new Error("No prompts found");

    await db.update(games)
      .set({
        status: "playing",
        currentPromptId: firstPrompt.id,
        roundNumber: 1,
      })
      .where(eq(games.id, gameId));

    revalidatePath(`/game/${gameId}`);
  } catch (error) {
    console.error("Failed to start game:", error);
    throw error; // Re-throw so the UI can handle the error if needed
  }
}