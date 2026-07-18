import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "@/data/landing";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge
            variant="secondary"
            className="mb-4 rounded-full px-3 py-1"
          >
            Platform capabilities
          </Badge>

          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything needed to manage a{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              modern workforce
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-pretty leading-7 text-muted-foreground sm:text-lg">
            Replace disconnected employee records and manual processes with
            a secure platform designed around clarity, accountability and
            organizational growth.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-border/70 bg-card/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 size-28 rounded-full bg-indigo-500/5 blur-2xl transition-colors group-hover:bg-indigo-500/15"
                />

                <CardHeader>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500/15 via-violet-500/10 to-blue-500/15 text-indigo-600 ring-1 ring-indigo-500/10 transition-transform duration-300 group-hover:scale-105 dark:text-indigo-400">
                      <Icon className="size-5" />
                    </div>

                    <span className="text-xs font-semibold text-muted-foreground/40">
                      0{index + 1}
                    </span>
                  </div>

                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-6">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Built for EmpNexa
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
