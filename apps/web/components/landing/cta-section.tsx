import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ready to empower your workforce?
        </h2>

        <p className="mt-5 text-pretty leading-7 text-muted-foreground sm:text-lg">
          Join EmpNexa today and transform how you manage employee records,
          organizational structure, and team access.
        </p>

        <Link
          href="/login"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 h-12 gap-2 rounded-xl bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 px-8 text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl",
          )}
        >
          Sign in to EmpNexa
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
