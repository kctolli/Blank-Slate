"use client";

import { useActionState } from "react"; // Add this
import { nextRoundAction } from "@/actions/nextRoundAction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoundResult {
  word: string;
  playerNames: string[];
  pointsEarned: number;
}

interface ResultsViewProps {
  gameId: string;
  results: RoundResult[];
  isHost: boolean;
}

export function ResultsView({ gameId, results, isHost }: ResultsViewProps) {
  const nextRoundWithId = nextRoundAction.bind(null, gameId);
  const [state, dispatch, isPending] = useActionState(nextRoundWithId, null);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">ROUND RESULTS</h2>
        <p className="text-slate-500 font-medium">See who was on the same wavelength!</p>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card 
            key={index} 
            className={`overflow-hidden border-2 ${
              result.pointsEarned > 0 ? "border-blue-200 bg-blue-50/30" : "border-slate-100"
            }`}
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center">
                {/* The Word Section */}
                <div className="p-6 flex-1 text-center md:text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    The Word
                  </span>
                  <h3 className="text-4xl font-black text-slate-800 uppercase">
                    {result.word}
                  </h3>
                </div>

                {/* The Players Section */}
                <div className="p-6 flex-1 border-t md:border-t-0 md:border-l border-slate-100">
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    {result.playerNames.map((name) => (
                      <Badge key={name} variant="secondary" className="text-sm px-3">
                        <Users className="h-3 w-3 mr-1" />
                        {name}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Points Badge */}
                  <div className="flex items-center gap-2">
                    {result.pointsEarned > 0 ? (
                      <div className="flex items-center text-blue-600 font-bold">
                        <Star className="h-4 w-4 mr-1 fill-blue-600" />
                        +{result.pointsEarned} Points each!
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">No match this time.</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isHost && (
        <div className="pt-6">
          <form action={dispatch}>
            <Button 
              size="lg" 
              disabled={isPending}
              className="w-full h-16 text-xl font-bold bg-slate-900 hover:bg-black shadow-xl group"
            >
              {isPending ? "Loading..." : "NEXT ROUND"}
              {!isPending && <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
