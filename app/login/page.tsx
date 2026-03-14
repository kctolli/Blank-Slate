import Link from "next/link";
import { Trophy } from "lucide-react";
import { joinGameAction } from "@/actions/joinGameAction"; 
import { createGameAction } from "@/actions/createGameAction"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Blank Slate</CardTitle>
          <CardDescription>The game where great minds think alike.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="join">Join Game</TabsTrigger>
              <TabsTrigger value="create">Host New</TabsTrigger>
            </TabsList>

            {/* JOIN GAME TAB */}
            <TabsContent value="join">
              <form action={joinGameAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" placeholder="Enter your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomCode">Room Code</Label>
                  <Input 
                    id="roomCode" 
                    name="roomCode" 
                    placeholder="e.g. ABCD" 
                    className="uppercase font-mono text-lg"
                    maxLength={4} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Join Room
                </Button>
              </form>
            </TabsContent>

            {/* CREATE GAME TAB */}
            <TabsContent value="create">
              <form action={createGameAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hostName">Your Name</Label>
                  <Input id="hostName" name="name" placeholder="Enter your name" required />
                </div>
                <p className="text-xs text-muted-foreground">
                  As the host, you'll be able to start the game once everyone joins.
                </p>
                <Button type="submit" className="w-full">
                  Create Private Room
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-auto pt-12 text-center">
            <Link 
              href="/hall-of-fame" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold text-sm group"
            >
              <Trophy className="h-4 w-4 group-hover:scale-110 transition-transform" />
              View the Global Hall of Fame
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}