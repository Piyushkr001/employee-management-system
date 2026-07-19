"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function EmployeesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Employees page error:", error);
  }, [error]);

  return (
    <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
        <p className="text-muted-foreground max-w-[500px]">
          {error.message || "An error occurred while loading the employees list. Please try again."}
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
