import Link from "next/link";
import { ArrowRight, BadgeCheck, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganizationPreview } from "./organization-preview";

export function HierarchySection() {
  return (
    <section
      id="hierarchy"
      className="relative scroll-mt-24 overflow-hidden border-y border-border/70 bg-muted/20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute -left-48 top-1/2 -z-10 size-[500px] -translate-y-1/2 rounded-full bg-violet-500/10 blur-[120px]"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-14 lg:flex-row lg:gap-20">
        <div className="flex w-full flex-1 flex-col items-start">
          <Badge
            variant="outline"
            className="mb-4 rounded-full border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-violet-300"
          >
            <Network className="mr-2 size-3.5" />
            Organizational hierarchy
          </Badge>

          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            See how every employee connects
          </h2>

          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Create clear reporting relationships, identify direct reports
            and understand your organization from leadership to individual
            contributors.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Assign reporting managers",
              "View direct reports",
              "Prevent circular reporting",
              "Display the complete tree",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-sm font-medium shadow-sm"
              >
                <BadgeCheck className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                {item}
              </div>
            ))}
          </div>

          <Link
            href="/login"
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "mt-8 gap-2 rounded-xl",
            )}
          >
            Explore your organization
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="w-full flex-1">
          <OrganizationPreview />
        </div>
      </div>
    </section>
  );
}
