"use server" // This directive tells Next.js: "Run these functions ONLY on the server"

import { db } from "@/db";
import { games } from "@/db/schema";
import generateRoomCode from "@/lib/generateRoomCode";
import { redirect } from "next/navigation";

export async function createGameAction() {
  const roomCode = generateRoomCode();

  await db.insert(games).values({
    id: roomCode,
    status: "waiting",
  });

  // Next.js handles the redirect on the server
  redirect(`/game/${roomCode}`);
}
