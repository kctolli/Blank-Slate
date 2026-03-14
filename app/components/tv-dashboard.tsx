"use client";

import { usePolling } from "@/hooks/use-polling";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Hash, Layers } from "lucide-react";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface TVDashboardProps {
  gameId: string;
  roundNumber: number;
  players: Player[];
  status: string; // 'waiting', 'playing', 'scoring'
  currentPrompt?: string;
}

export function TVDashboard({ gameId, roundNumber, players, status, currentPrompt }: TVDashboardProps) {  // Sort players by score for the "Hall of Fame"
  usePolling(1500);
  
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const leader = sortedPlayers[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 font-sans overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-12 border-b border-slate-800 pb-8">
        <div className="space-y-1">
          <h1 className="text-6xl font-black tracking-tighter text-blue-500">BLANK SLATE</h1>
          <div className="flex gap-6 text-2xl font-medium text-slate-400">
            <span className="flex items-center gap-2">
              <Hash className="text-blue-500" /> ROOM: <span className="text-white">{gameId}</span>
            </span>
            <span className="flex items-center gap-2">
              <Users className="text-blue-500" /> PLAYERS: <span className="text-white">{players.length}</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-1">Current Round</div>
          <div className="text-8xl font-black text-white">{roundNumber}</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* LEFT COLUMN: LIVE GAME STATE */}
        <div className="col-span-7 space-y-8">
          <Card className="bg-slate-900 border-slate-800 shadow-2xl h-[400px] flex flex-col justify-center items-center text-center p-12">
            {status === "waiting" ? (
              <div className="space-y-6">
                <div className="text-3xl text-slate-400 font-medium">Join at <span className="text-blue-400">blankslate.tech</span></div>
                <div className="text-9xl font-black text-white animate-pulse">{gameId}</div>
              </div>
            ) : (
              <div className="space-y-4">
                <Badge className="bg-blue-600 text-xl px-6 py-1 mb-4">THE PROMPT</Badge>
                <h2 className="text-7xl font-bold leading-tight text-white uppercase tracking-tight">
                  {currentPrompt?.split("_____").map((part, i) => (
                    <span key={i}>
                      {part}
                      {i === 0 && <span className="text-blue-500 mx-4 inline-block border-b-8 border-blue-500 w-48"></span>}
                    </span>
                  ))}
                </h2>
              </div>
            )}
          </Card>

          {/* STATUS FOOTER */}
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 flex items-center justify-between">
            <span className="text-2xl font-semibold text-blue-400 uppercase tracking-widest">
              {status === "playing" ? "Waiting for Submissions..." : "Get Ready!"}
            </span>
            <div className="flex gap-2">
               {players.map((_, i) => (
                 <div key={i} className="h-4 w-4 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
               ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LEADERBOARD */}
        <div className="col-span-5">
          <Card className="bg-slate-900 border-slate-800 h-full shadow-2xl overflow-hidden">
            <CardHeader className="bg-slate-800/50 p-6">
              <CardTitle className="flex items-center gap-3 text-2xl uppercase tracking-widest text-slate-300">
                <Trophy className="text-yellow-500" /> Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id}
                  className={`flex justify-between items-center p-6 border-b border-slate-800 transition-colors ${
                    index === 0 ? "bg-yellow-500/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <span className={`text-3xl font-bold w-10 ${index === 0 ? "text-yellow-500" : "text-slate-500"}`}>
                      #{index + 1}
                    </span>
                    <span className="text-4xl font-bold truncate max-w-[250px]">{player.name}</span>
                  </div>
                  <span className="text-5xl font-black text-blue-400">{player.score}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
