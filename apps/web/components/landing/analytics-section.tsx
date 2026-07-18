import { CalendarDays, BarChart3, Activity, SlidersHorizontal, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AnalyticsSection() {
  return (
    <section className="border-y border-border/70 bg-muted/20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-14 lg:flex-row lg:gap-20">
        <div className="w-full flex-1">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card p-5 shadow-2xl shadow-indigo-500/10 sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold">Department overview</p>
                <p className="text-xs text-muted-foreground">
                  Employee distribution across the organization
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Current year
              </div>
            </div>

            <div className="flex h-64 items-end justify-between gap-3 rounded-2xl bg-muted/30 p-4 sm:gap-5 sm:p-6">
              {[
                {
                  name: "Eng.",
                  value: 92,
                },
                {
                  name: "HR",
                  value: 48,
                },
                {
                  name: "Sales",
                  value: 72,
                },
                {
                  name: "Design",
                  value: 58,
                },
                {
                  name: "Ops.",
                  value: 67,
                },
                {
                  name: "Finance",
                  value: 42,
                },
              ].map((item, index) => (
                <div
                  key={item.name}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >
                  <span className="text-xs font-semibold">
                    {Math.round(item.value * 0.7)}
                  </span>

                  <div
                    style={{ height: `${item.value}%` }}
                    className={cn(
                      "w-full max-w-12 rounded-t-lg bg-linear-to-t shadow-sm",
                      index % 3 === 0 &&
                        "from-indigo-600 to-indigo-400",
                      index % 3 === 1 &&
                        "from-violet-600 to-violet-400",
                      index % 3 === 2 && "from-blue-600 to-blue-400",
                    )}
                  />

                  <span className="text-[10px] text-muted-foreground sm:text-xs">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Growth",
                  value: "+12.4%",
                },
                {
                  label: "Retention",
                  value: "94.2%",
                },
                {
                  label: "Open roles",
                  value: "16",
                },
                {
                  label: "New joins",
                  value: "18",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/70 bg-background/70 p-3"
                >
                  <p className="text-base font-bold">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col items-start">
          <Badge
            variant="outline"
            className="mb-4 rounded-full border-indigo-500/20 bg-indigo-500/5 text-indigo-700 dark:text-indigo-300"
          >
            <BarChart3 className="mr-2 size-3.5" />
            Actionable insights
          </Badge>

          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Understand your workforce at a glance
          </h2>

          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Monitor employee status, department distribution and workforce
            changes through a dashboard designed for quick and confident
            decision-making.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {[
              {
                icon: Activity,
                title: "Live workforce overview",
                description:
                  "View active, inactive and total employee counts from one dashboard.",
              },
              {
                icon: SlidersHorizontal,
                title: "Flexible search and filters",
                description:
                  "Find the right employee using role, status, department and sorting controls.",
              },
              {
                icon: Zap,
                title: "Faster daily operations",
                description:
                  "Reduce repetitive administration with focused workflows and centralized data.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Icon className="size-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
