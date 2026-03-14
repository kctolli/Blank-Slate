import Link from "next/link";
import { Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function JoinPage({ searchParams }: { searchParams: { code?: string } }) {
    // Pass defaultCode to your Input's defaultValue prop
  const defaultCode = searchParams.code || "";

  return (
    <>
        <Input name="roomCode" defaultValue={defaultCode} className="uppercase" />
        <div className="mt-12 text-center">
            <Link 
                href="/hall-of-fame" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold text-sm group"
            >
                <Trophy className="h-4 w-4 group-hover:scale-110 transition-transform" />
                View the Global Hall of Fame
            </Link>
        </div>
    </>
  );
}
