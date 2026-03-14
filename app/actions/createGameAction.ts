"use server"

import { db } from "@/db";
import { games, players } from "@/db/schema";
import generateRoomCode from "@/lib/generateRoomCode";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// 1. Add prevState as the first argument
export async function createGameAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const roomCode = generateRoomCode();

  if (!name) {
    return { error: "Name is required to host a game." };
  }

  try {
    // 2. Create the game
    await db.insert(games).values({ 
      id: roomCode, 
      status: "waiting",
      roundNumber: 1 // Ensure this matches your schema update
    });

    // 3. Add the host as a player with the 'host' role
    const playerResult = await db.insert(players).values({
      gameId: roomCode,
      name: name.trim(),
      role: "host", // Explicitly set as host
    }).returning({ id: players.id });

    const hostId = playerResult[0].id;

    // 4. Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set('player_id', hostId.toString(), {
      maxAge: 60 * 60 * 24,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

  } catch (error) {
    // Handle redirect errors specifically
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Create Game Error:", error);
    return { error: "Database failure. Please try again." };
  }

  // 5. Final Redirect
  redirect(`/game/${roomCode}`);
}
