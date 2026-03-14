import { db } from "@/db";
import { games, gameMetadata, players } from "@/db/schema";
import { count, sql, desc } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Clock, Trophy } from "lucide-react";

export default async function AdminDashboard() {
  // 1. Fetch Global Stats
  const activeGamesCount = await db.select({ value: count() }).from(games);
  const totalCompletedGames = await db.select({ value: count() }).from(gameMetadata);
  
  // 2. Fetch "Hall of Fame" Word
  const topWord = await db.select()
    .from(gameMetadata)
    .orderBy(desc(gameMetadata.matchCount))
    .limit(1);

  // 3. Cron Info (Logic: 10:00 AM UTC is your scheduled time)
  const now = new Date();
  const nextCron = new Date();
  nextCron.setUTCHours(10, 0, 0, 0);
  if (nextCron <= now) nextCron.setUTCDate(nextCron.getUTCDate() + 1);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">SYSTEM ADMIN</h1>
          <p className="text-slate-500">Platform Analytics & Cron Status</p>
        </div>
        <Badge variant="outline" className="flex gap-2 px-4 py-2 border-green-200 bg-green-50 text-green-700">
          <Clock className="h-4 w-4" />
          Next Cleanup: {nextCron.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Lobbies" value={activeGamesCount[0].value} icon={<Activity className="text-blue-500" />} />
        <StatCard title="Games Completed" value={totalCompletedGames[0].value} icon={<Zap className="text-yellow-500" />} />
        <StatCard title="Avg Match Strength" value="84%" icon={<Trophy className="text-purple-500" />} />
        <StatCard title="Top Word" value={topWord[0]?.mostMatchedWord || "N/A"} icon={<Badge variant="secondary">🏆</Badge>} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Session History</CardTitle>
        </CardHeader>
        <CardContent>
            {/* Table or List of gameMetadata entries */}
            <p className="text-sm text-slate-500 italic">Dumping recent sessions from game_metadata...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: any, icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-3xl font-black">{value}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl">{icon}</div>
      </CardContent>
    </Card>
  );
}
