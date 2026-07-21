"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold tracking-tight">Something went wrong</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          An unexpected error occurred while loading this page. Please try again.
        </p>
      </div>
      <Button onClick={() => reset()} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
