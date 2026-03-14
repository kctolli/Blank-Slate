"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function usePolling(interval: number = 2000) {
  const router = useRouter();

  useEffect(() => {
    // Set up the interval
    const timer = setInterval(() => {
      router.refresh();
    }, interval);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timer);
  }, [router, interval]);
}
