"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Home, Star } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface GameOverProps {
  players: Player[];
  gameId: string;
}

export function GameOver({ players, gameId }: GameOverProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  // Fire confetti when the winner is revealed!
  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Card className="border-4 border-yellow-400 shadow-2xl overflow-hidden bg-slate-50">
        <div className="bg-yellow-400 py-8 text-center">
          <Trophy className="h-20 w-20 text-white mx-auto drop-shadow-lg animate-bounce" />
          <h1 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">GAME OVER</h1>
          <p className="text-yellow-900 font-bold uppercase tracking-widest text-sm">We have a winner!</p>
        </div>

        <CardContent className="p-8">
          {/* WINNER SECTION */}
          <div className="text-center mb-10">
            <h2 className="text-5xl font-black text-slate-800 break-words">
              {winner.name}
            </h2>
            <div className="flex justify-center items-center gap-2 mt-2">
              <Star className="text-yellow-500 fill-yellow-500 h-5 w-5" />
              <span className="text-2xl font-bold text-slate-600">{winner.score} Points</span>
              <Star className="text-yellow-500 fill-yellow-500 h-5 w-5" />
            </div>
          </div>

          {/* FINAL STANDINGS */}
          <div className="space-y-3 mb-10">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] text-center mb-4">Final Standings</h3>
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id} 
                className={`flex justify-between items-center p-4 rounded-xl border-2 ${
                  index === 0 ? "bg-white border-yellow-400" : "bg-slate-100 border-transparent"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-black text-xl text-slate-400">#{index + 1}</span>
                  <span className="font-bold text-lg text-slate-700">{player.name}</span>
                </div>
                <Badge variant={index === 0 ? "default" : "secondary"} className="text-lg px-4">
                  {player.score}
                </Badge>
              </div>
            ))}
          </div>

          {/* NAVIGATION ACTIONS */}
          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" size="lg" className="h-14 font-bold border-2">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" /> HOME
              </Link>
            </Button>
            <Button asChild size="lg" className="h-14 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Link href="/login">
                <RotateCcw className="mr-2 h-5 w-5" /> NEW GAME
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
