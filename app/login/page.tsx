"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Trophy, Loader2 } from "lucide-react";
import { joinGameAction } from "@/actions/joinGameAction"; 
import { createGameAction } from "@/actions/createGameAction"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  // 1. Initialize Action States
  const [joinState, joinDispatch, joinPending] = useActionState(joinGameAction, null);
  const [createState, createDispatch, createPending] = useActionState(createGameAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Blank Slate</CardTitle>
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
              <form action={joinDispatch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" placeholder="Enter your name" required disabled={joinPending} />
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
                    disabled={joinPending}
                  />
                </div>

                {/* Display Error Message for Join */}
                {joinState?.error && (
                  <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                    {joinState.error}
                  </p>
                )}

                <Button type="submit" disabled={joinPending} className="w-full bg-green-600 hover:bg-green-700">
                  {joinPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Join Room"}
                </Button>
              </form>
            </TabsContent>

            {/* CREATE GAME TAB */}
            <TabsContent value="create">
              <form action={createDispatch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hostName">Your Name</Label>
                  <Input id="hostName" name="name" placeholder="Enter your name" required disabled={createPending} />
                </div>
                <p className="text-xs text-muted-foreground italic">
                  As the host, you'll be able to start the game once everyone joins.
                </p>

                {/* Display Error Message for Create */}
                {createState?.error && (
                  <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                    {createState.error}
                  </p>
                )}

                <Button type="submit" disabled={createPending} className="w-full">
                  {createPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Private Room"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
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
