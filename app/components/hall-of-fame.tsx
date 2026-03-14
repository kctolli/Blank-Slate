import { db } from "@/db";
import { gameMetadata } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Users, Zap } from "lucide-react";

export async function HallOfFame() {
  // Fetch the top 5 most matched words of all time
  const topWords = await db
    .select()
    .from(gameMetadata)
    .orderBy(desc(gameMetadata.matchCount))
    .limit(5);

  // Fetch the highest winning score ever recorded
  const recordGame = await db
    .select()
    .from(gameMetadata)
    .orderBy(desc(gameMetadata.winningScore))
    .limit(1);

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto p-4">
      <div className="text-center space-y-2">
        <Trophy className="h-12 w-12 text-yellow-500 mx-auto drop-shadow-sm" />
        <h2 className="text-3xl font-black tracking-tight italic">HALL OF FAME</h2>
      </div>

      {/* Record Breaker Card */}
      {recordGame[0] && (
        <Card className="bg-slate-900 text-white border-none shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">All-Time High Score</p>
              <p className="text-3xl font-black text-yellow-400">{recordGame[0].winningScore} Points</p>
            </div>
            <Star className="h-10 w-10 text-yellow-400 fill-current" />
          </CardContent>
        </Card>
      )}

      {/* Top Words List */}
      <Card className="border-2 border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" /> Most Matched Words
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topWords.map((item, index) => (
            <div key={index} className="flex justify-between items-center group">
              <div className="flex items-center gap-3">
                <span className="text-slate-300 font-black text-xl w-6">#{index + 1}</span>
                <span className="text-lg font-bold text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                  {item.mostMatchedWord}
                </span>
              </div>
              <Badge variant="secondary" className="font-mono">
                {item.matchCount} Matches
              </Badge>
            </div>
          ))}
          {topWords.length === 0 && (
            <p className="text-center text-slate-400 italic py-4">The legend begins today...</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 text-slate-400 text-xs font-medium uppercase tracking-tighter">
        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {recordGame[0]?.totalPlayers || 0} Players</span>
        <span>•</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}
