"use client";

import { useEffect } from "react";

export function InactiveSessionCleanup() {
  useEffect(() => {
    async function clearSession() {
      try {
        await fetch("/backend/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-EmpNexa-Request": "web",
          },
        });
      } catch {
        // Continue with local cookie cleanup.
      }

      await fetch("/api/auth/clear-session", {
        method: "POST",
        credentials: "include",
      });
    }

    void clearSession();
  }, []);

  return null;
}
