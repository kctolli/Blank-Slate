"use server"

import { db } from "@/db";
import { games, players } from "@/db/schema";
import generateRoomCode from "@/lib/generateRoomCode";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // Add this

export async function createGameAction(formData: FormData) {
  const name = formData.get("name") as string;
  const roomCode = generateRoomCode();

  try {
    // 1. Create the game
    await db.insert(games).values({ id: roomCode, status: "waiting" });

    // 2. Add the host as a player and get their ID
    const playerResult = await db.insert(players).values({
      gameId: roomCode,
      name: name,
    }).returning({ id: players.id });

    const hostId = playerResult[0].id;

    // 3. Set the session cookie so the host isn't kicked out by Middleware
    const cookieStore = await cookies();
    cookieStore.set('player_id', hostId.toString(), {
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

  } catch (error) {
    console.error("Create Game Error:", error);
    return { error: "Failed to create game." };
  }

  // 4. Redirect
  redirect(`/game/${roomCode}`);
}
