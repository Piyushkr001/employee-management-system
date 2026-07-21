"use client";
import * as React from "react";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const [isClearing, setIsClearing] = React.useState(false);

  const handleClearSession = async () => {
    setIsClearing(true);
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
      })
    ]);
    
    router.replace("/login");
    router.refresh();
  };
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
        <ShieldAlert className="size-10 text-destructive" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">403 Forbidden</h1>
      <p className="mt-4 max-w-sm text-muted-foreground">
        You do not have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/profile" className={cn(buttonVariants())}>
          Return to Profile
        </Link>
        <Button variant="outline" onClick={handleClearSession} disabled={isClearing}>
          {isClearing ? "Clearing..." : "Clear Session & Logout"}
        </Button>
      </div>
    </div>
  );
}
