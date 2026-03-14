"use server";

import { db } from "@/db";
import { players } from "@/db/schema";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// 1. Add 'prevState' as the first parameter
export async function joinGameAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const gameId = formData.get("roomCode") as string;

  if (!name || !gameId) {
    return { error: "Name and Room Code are required" };
  }

  const formattedGameId = gameId.toUpperCase().trim();
  let success = false;

  try {
    const result = await db.insert(players)
      .values({
        gameId: formattedGameId,
        name: name.trim(),
        // Since you implemented metadata, ensure 'role' is set to 'player'
        role: "player" 
      })
      .onConflictDoUpdate({
        target: [players.gameId, players.name],
        set: { name: name.trim() }
      })
      .returning();

    const player = result[0];

    const cookieStore = await cookies();
    cookieStore.set('player_id', player.id.toString(), {
      maxAge: 60 * 60 * 24,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

    success = true; 
  } catch (error) {
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Join Error:", error);
    // Explicit return for the joinState.error in your login page
    return { error: "Failed to join game. Check your code and try again." };
  }

  if (success) {
    redirect(`/game/${formattedGameId}`);
  }
}
