"use client";

import { startGameAction } from "@/actions/startGameAction";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Play } from "lucide-react";

interface StartGameProps {
  gameId: string;
  isHost: boolean;
  playerCount: number;
  currentPlayerId: number; // Add this!
}

export function StartGameButton({ gameId, isHost, playerCount, currentPlayerId }: StartGameProps) {
  if (!isHost) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-center">
        <p className="text-amber-800 font-medium">
          Waiting for the host to start the game...
        </p>
        <p className="text-amber-600 text-sm">
          {playerCount} {playerCount === 1 ? 'player' : 'players'} currently in room
        </p>
      </div>
    );
  }

  // The "action" attribute can take a bound function
  // This is where we inject the arguments the server needs
  const startGameWithId = startGameAction.bind(null, gameId, currentPlayerId);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* We use the bound function here */}
      <form action={startGameWithId} className="w-full">
        <SubmitButton disabled={playerCount < 3} />
      </form>
      
      {playerCount < 3 && (
        <p className="text-sm text-slate-500 italic">
          Need at least 3 players to start (Current: {playerCount})
        </p>
      )}
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      size="lg"
      disabled={disabled || pending}
      className="w-full h-16 text-xl font-bold shadow-xl transition-all hover:scale-105"
    >
      {pending ? (
        "Setting up cards..."
      ) : (
        <>
          <Play className="mr-2 h-6 w-6 fill-current" />
          START GAME
        </>
      )}
    </Button>
  );
}