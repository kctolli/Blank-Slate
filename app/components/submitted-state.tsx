"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2 } from "lucide-react";

interface SubmittedStateProps {
  word: string;
  playerName: string;
}

export function SubmittedState({ word, playerName }: SubmittedStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
      <Card className="border-4 border-green-500 bg-white shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-500 p-4 flex items-center justify-center gap-3 text-white">
          <CheckCircle2 className="h-6 w-6 fill-white text-green-500" />
          <span className="font-black text-xl tracking-tight uppercase">LOCKED IN</span>
        </div>

        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-2">
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
              Your Blank Slate word
            </p>
            {/* The "Really Large" text you requested */}
            <h2 className="text-7xl md:text-9xl font-black text-slate-900 uppercase tracking-tighter break-all leading-none">
              {word}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Badge variant="secondary" className="px-6 py-2 text-md rounded-full bg-slate-100 text-slate-600 border-none">
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-500" />
              Waiting for other players...
            </Badge>
            
            <p className="text-slate-400 text-sm italic">
              Nice choice, {playerName.split(' ')[0]}! Sit tight while the others finish.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Visual Progress Hint */}
      <div className="mt-8 text-center">
        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest animate-pulse">
          Syncing with Neon Database...
        </p>
      </div>
    </div>
  );
}