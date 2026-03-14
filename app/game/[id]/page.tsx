import { eq, sql, and } from "drizzle-orm";
import { Crown, User } from "lucide-react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { db } from "@/db";
import { games, players, answers } from "@/db/schema";

import { GameBoard } from "@/components/game-board";
import { ResultsView } from "@/components/results-view";
import { StartGameButton } from "@/components/start-game-button";
import { SubmittedState } from "@/components/submitted-state";
import { GameRefreshHandler } from "@/components/game-refresh-handler";
import { Badge } from "@/components/ui/badge";

export default async function GameRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    redirect("/");
  }

  const gameId = resolvedParams.id.toUpperCase();
  const cookieStore = await cookies();
  const playerId = cookieStore.get("player_id")?.value;

  // 1. Fetch Game, Players, and Prompts
  // We sort players by ID to ensure de-facto host fallback is consistent
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
    with: {
      players: {
        orderBy: (players, { asc }) => [asc(players.id)],
      },
      currentPrompt: true,
    },
  });

  if (!game) redirect("/");

  // 2. Identify the current user from the cookie
  const currentPlayer = game.players.find((p) => p.id.toString() === playerId);
  if (!currentPlayer) redirect(`/?code=${gameId}`);

  // 3. Metadata Host Logic
  let isHost = currentPlayer?.role === "host";

  // Fallback: If no host is explicitly set, the first player to join (lowest ID) is host
  const hasActiveHost = game.players.some(p => p.role === "host");
  if (!hasActiveHost && game.players.length > 0) {
    if (game.players[0].id === currentPlayer.id) {
      isHost = true;
    }
  }

  // 4. Round Data Fetching
  const playerAnswer = await db.query.answers.findFirst({
    where: and(
      eq(answers.gameId, gameId),
      eq(answers.playerId, currentPlayer.id),
      eq(answers.roundNumber, game.roundNumber)
    ),
  });

  const allAnswers = await db.query.answers.findMany({
    where: and(
      eq(answers.gameId, gameId),
      eq(answers.roundNumber, game.roundNumber)
    ),
  });

  // Calculate if the round is finished
  const isRoundOver = allAnswers.length === game.players.length && game.players.length > 0;

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Auto-refresh engine: keeps the UI in sync for everyone in the room */}
      <GameRefreshHandler status={game.status} />

      {/* PHASE 1: THE LOBBY */}
      {game.status === "waiting" ? (
        <div className="max-w-md mx-auto py-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">{gameId}</h1>
            <p className="text-slate-500 font-medium mt-2">Waiting for the crew to join...</p>
          </div>

          <div className="space-y-3">
            {game.players.map((p) => (
              <div 
                key={p.id} 
                className={`flex justify-between items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                  p.role === 'host' || (p.id === game.players[0].id && !hasActiveHost)
                    ? "border-yellow-400 bg-yellow-50 shadow-sm" 
                    : "border-white bg-white shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  {(p.role === 'host' || (p.id === game.players[0].id && !hasActiveHost)) ? (
                    <Crown className="h-5 w-5 text-yellow-600 fill-yellow-400" />
                  ) : (
                    <User className="h-5 w-5 text-slate-400" />
                  )}
                  <span className={`font-bold ${p.role === 'host' ? "text-yellow-900" : "text-slate-700"}`}>
                    {p.name} {p.id === currentPlayer.id && <span className="text-xs font-normal opacity-60 ml-1">(You)</span>}
                  </span>
                </div>
                
                {/* HOST-ONLY MANAGEMENT TOOLS */}
                {isHost && p.id !== currentPlayer.id && (
                   <div className="flex gap-2">
                     <Badge variant="outline" className="text-[10px] uppercase border-slate-200 text-slate-400">
                       Guest
                     </Badge>
                     {/* Add KickPlayer action here in the future */}
                   </div>
                )}
              </div>
            ))}
          </div>

          {/* This button only enables/shows for the Host */}
          <div className="pt-4">
            <StartGameButton gameId={gameId} isHost={isHost} playerCount={game.players.length} currentPlayerId={currentPlayer.id} />
          </div>
        </div>
      ) : isRoundOver ? (
        /* PHASE 2: RESULTS VIEW (Scoring) */
        <ResultsView 
          gameId={gameId} 
          results={allAnswers.map(a => ({
            word: a.word,
            playerNames: [game.players.find(p => p.id === a.playerId)?.name || "Unknown"],
            pointsEarned: 0 // Handled by server-side point calculation action
          }))} 
          isHost={isHost} 
        />
      ) : (
        /* PHASE 3: ACTIVE PLAYING (GameBoard or Submitted State) */
        <div className="py-8 px-4 max-w-2xl mx-auto">
          {playerAnswer ? (
            <SubmittedState word={playerAnswer.word} playerName={currentPlayer.name} />
          ) : (
            <GameBoard
              gameId={gameId}
              roundNumber={game.roundNumber}
              prompt={game.currentPrompt?.text || "_____"}
              players={game.players}
              currentPlayerId={currentPlayer.id}
              hasSubmitted={false}
              currentPlayerName={currentPlayer.name}
            />
          )}
        </div>
      )}
    </main>
  );
}