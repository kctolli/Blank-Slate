"use server";

import { db } from "@/db";
import { players } from "@/db/schema";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function joinGameAction(formData: FormData) {
  const name = formData.get("name") as string;
  const gameId = formData.get("roomCode") as string;

  // 1. Validation check
  if (!name || !gameId) return { error: "Name and Room Code are required" };

  const formattedGameId = gameId.toUpperCase().trim();
  let success = false;

  try {
    const result = await db.insert(players)
      .values({
        gameId: formattedGameId,
        name: name.trim(),
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

    success = true; // Mark as successful
  } catch (error) {
    // Check if this is a Next.js redirect error and re-throw it if so
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Join Error:", error);
    return { error: "Failed to join game database." };
  }

  // 3. Final Redirect
  if (success) {
    redirect(`/game/${formattedGameId}`);
  }
}
