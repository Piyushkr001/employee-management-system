"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type CleanupState = "idle" | "clearing" | "cleared" | "failed";

export function InactiveSessionCleanup() {
  const router = useRouter();
  const [state, setState] = useState<CleanupState>("idle");

  useEffect(() => {
    async function clearSession() {
      setState("clearing");
      try {
        await Promise.allSettled([
          fetch("/backend/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "X-EmpNexa-Request": "web",
            },
          }),
          fetch("/api/auth/clear-session", {
            method: "POST",
            credentials: "include",
          }),
        ]);
      } catch {
        // Safe fallback
      } finally {
        setState("cleared");
        router.replace("/login?reason=inactive&cleared=1");
        router.refresh();
      }
    }

    if (state === "idle") {
      void clearSession();
    }
  }, [router, state]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="animate-pulse space-y-4 text-center">
        <h2 className="text-xl font-medium tracking-tight">Clearing your previous session…</h2>
        <p className="text-sm text-muted-foreground">Please wait a moment while we safely sign you out.</p>
      </div>
    </div>
  );
}
