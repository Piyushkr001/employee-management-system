import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  return (
    <section id="home" className="relative isolate scroll-mt-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-60 bg-[linear-gradient(to_right,rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-size-[48px_48px] dark:opacity-30"
      />

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 size-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 top-1/3 -z-10 size-[450px] rounded-full bg-violet-500/15 blur-[120px]"
      />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:flex-row lg:gap-12 lg:px-8 lg:py-28">
        <div className="flex w-full flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <Badge
            variant="outline"
            className="mb-6 gap-2 rounded-full border-indigo-500/20 bg-indigo-500/5 px-3.5 py-1.5 text-indigo-700 shadow-sm dark:text-indigo-300"
          >
            <Sparkles className="size-3.5" />
            Modern employee management
          </Badge>

          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.05]">
            Manage your people.
            <span className="mt-1 block bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-blue-400">
              Empower your teams.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            EmpNexa brings employee records, role-based access, reporting
            structures and workforce insights into one secure and
            beautifully organized platform.
          </p>

          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  size: "lg",
                }),
                "h-12 w-full gap-2 rounded-xl bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 px-6 text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-xl sm:w-auto",
              )}
            >
              Access EmpNexa
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/#features"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                }),
                "h-12 w-full gap-2 rounded-xl border-border/80 bg-background/60 px-6 backdrop-blur transition-all hover:-translate-y-0.5 sm:w-auto",
              )}
            >
              Explore features
              <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-muted-foreground lg:justify-start">
            {[
              "Secure access",
              "Responsive workspace",
              "Real-time insights",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full flex-1">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
