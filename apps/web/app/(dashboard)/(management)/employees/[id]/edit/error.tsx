"use client";
import { RouteError } from "@/components/layout/route-error";
import { useEffect } from "react";
export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <RouteError error={error} reset={reset} />;
}
