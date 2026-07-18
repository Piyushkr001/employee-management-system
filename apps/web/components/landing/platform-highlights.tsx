import { platformHighlights } from "@/data/landing";

export function PlatformHighlights() {
  return (
    <section className="border-y border-border/70 bg-muted/20">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-4 py-7 sm:px-6 lg:justify-between lg:px-8">
        {platformHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Icon className="size-4" />
              </span>
              {item.label}
            </div>
          );
        })}
      </div>
    </section>
  );
}
