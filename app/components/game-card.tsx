import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface GameCardProps {
  prompt: string; // e.g., "_____ BOARD"
  isSubmitted: boolean;
}

export function GameCard({ prompt, isSubmitted }: GameCardProps) {
  // Split the prompt by the underscores
  const parts = prompt.split("_____");

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-2 border-slate-200 bg-white">
      <CardContent className="p-12 flex flex-col items-center justify-center space-y-8">
        <div className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 flex items-center gap-3 flex-wrap justify-center">
          {/* Prefix Text */}
          {parts[0] && <span>{parts[0]}</span>}

          {/* The Input or "Waiting" State */}
          {isSubmitted ? (
            <span className="px-6 py-1 bg-slate-100 rounded-md border-b-4 border-blue-500 text-blue-600 animate-pulse">
              ???
            </span>
          ) : (
            <Input
              name="word"
              autoFocus
              required
              placeholder="_____"
              className="w-40 h-14 text-2xl text-center border-0 border-b-4 border-slate-300 focus-visible:ring-0 focus-visible:border-blue-500 rounded-none transition-all uppercase"
              autoComplete="off"
              autoCorrect="off"
            />
          )}

          {/* Suffix Text */}
          {parts[1] && <span>{parts[1]}</span>}
        </div>

        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
          {isSubmitted ? "Waiting for others..." : "Type your word"}
        </p>
      </CardContent>
    </Card>
  );
}

export default GameCard;