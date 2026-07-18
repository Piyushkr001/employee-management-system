import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">401 - Unauthorized</h1>
      <p className="mt-2 text-muted-foreground">You do not have permission to access this page.</p>
      <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-6")}>
        Return Home
      </Link>
    </div>
  );
}
