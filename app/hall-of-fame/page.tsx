import { HallOfFame } from "@/components/hall-of-fame";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HallOfFamePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-lg mx-auto mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Join
          </Link>
        </Button>
      </div>
      
      <HallOfFame />
      
      <div className="max-w-lg mx-auto mt-12 text-center text-slate-400 text-sm">
        <p>Stats are updated every morning at 4:00 AM.</p>
      </div>
    </main>
  );
}
