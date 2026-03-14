"use client";

import { useState } from "react";
import { GameCard } from "./game-card";
import { usePolling } from "@/hooks/use-polling";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { submitAnswerAction } from "@/actions/submitAnswerAction";
import { Button } from "@/components/ui/button";
import { SubmittedState } from "@/components/submitted-state";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface GameBoardProps {
  gameId: string;
  roundNumber: number;
  prompt: string;
  players: Player[];
  currentPlayerId: number;
  hasSubmitted: boolean;
  currentPlayerName: string;
}

export function GameBoard({
  gameId,
  roundNumber,
  prompt,
  players,
  currentPlayerId,
  hasSubmitted: initialSubmitted,
  currentPlayerName
}: GameBoardProps) {
  usePolling(3000);

  const [isSubmitted, setIsSubmitted] = useState(initialSubmitted);
  const [submittedWord, setSubmittedWord] = useState<string>("");
  
  async function handleFormSubmit(formData: FormData) {
    const word = formData.get("word") as string;
    if (!word) return;

    setSubmittedWord(word); // Store it locally for the big text display
    setIsSubmitted(true);
    await submitAnswerAction(gameId, currentPlayerId, roundNumber, word);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="flex justify-between items-center px-2">
        <Badge variant="outline" className="text-lg px-4 py-1">
          Round {roundNumber}
        </Badge>
        <div className="text-sm text-muted-foreground font-mono">
          ROOM: {gameId}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Area: The Card */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <form action={handleFormSubmit}>
            <GameCard prompt={prompt} isSubmitted={isSubmitted} />
            
            {!isSubmitted && (
              <Button 
                type="submit" 
                className="w-full mt-6 h-14 text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                SUBMIT WORD
              </Button>
            )}
          </form>
        </div>

        {/* Sidebar: Scoreboard */}
        <div className="order-1 lg:order-2">
          <Card className="h-full border-2 border-slate-100 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-slate-500">
                Scoreboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player) => (
                  <div 
                    key={player.id} 
                    className={`flex justify-between items-center p-2 rounded-lg ${
                      player.id === currentPlayerId ? 'bg-blue-50 border border-blue-100' : ''
                    }`}
                  >
                    <span className="font-medium">
                      {player.name} {player.id === currentPlayerId && "(You)"}
                    </span>
                    <Badge variant="secondary" className="text-md">
                      {player.score}
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="lg:col-span-2 order-2 lg:order-1">
        {isSubmitted ? (
          <SubmittedState word={submittedWord} playerName={currentPlayerName} />
        ) : (
          <form action={handleFormSubmit}>
            <GameCard prompt={prompt} isSubmitted={false} />
            <Button type="submit" className="...">SUBMIT WORD</Button>
          </form>
        )}
      </div>

    </div>
  );
}
