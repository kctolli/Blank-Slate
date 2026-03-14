"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function GameRefreshHandler({ status }: { status: string }) {
  const router = useRouter();

  useEffect(() => {
    // Only poll if the game is in 'waiting' or 'playing' mode
    if (status === "finished") return;

    const interval = setInterval(() => {
      // router.refresh() tells Next.js to re-run the Server Component 
      // and fetch fresh data from Neon without losing client state.
      router.refresh();
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [status, router]);

  return null;
}
