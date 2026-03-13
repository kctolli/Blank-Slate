"use server" // This directive tells Next.js: "Run these functions ONLY on the server"

import { db } from "@/db";
import { players } from "@/db/schema";
import { redirect } from "next/navigation";

export async function joinGameAction(formData: FormData) {
  const roomCode = formData.get("roomCode") as string;
  const playerName = formData.get("playerName") as string;

  // 1. Check if game exists
  const game = await db.query.games.findFirst({
    where: (games, { eq }) => eq(games.id, roomCode.toUpperCase()),
  });

  if (!game) throw new Error("Game not found!");

  // 2. Add player to the database
  await db.insert(players).values({
    gameId: game.id,
    name: playerName,
  });

  redirect(`/game/${game.id}`);
}