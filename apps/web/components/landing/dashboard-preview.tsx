import { LockKeyhole, LayoutDashboard, Users, Network, Building2, Activity, UserRoundCheck, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { employeeRows } from "@/data/landing";

export function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-r from-indigo-500/20 via-violet-500/20 to-blue-500/20 blur-3xl" />

      <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/95 shadow-[0_30px_100px_-35px_rgba(79,70,229,0.55)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="hidden items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <LockKeyhole className="size-3" />
            Secure workspace
          </div>
        </div>

        <div className="flex min-h-[450px]">
          <aside className="hidden w-44 shrink-0 border-r border-border/70 bg-muted/20 p-4 sm:block">
            <div className="mb-7 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 via-violet-600 to-blue-600 text-xs font-bold text-white">
                E
              </div>
              <span className="font-bold">
                Emp<span className="text-indigo-600 dark:text-indigo-400">Nexa</span>
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {[
                {
                  label: "Dashboard",
                  icon: LayoutDashboard,
                  active: true,
                },
                {
                  label: "Employees",
                  icon: Users,
                  active: false,
                },
                {
                  label: "Organization",
                  icon: Network,
                  active: false,
                },
                {
                  label: "Departments",
                  icon: Building2,
                  active: false,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium",
                      item.active
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0 flex-1 bg-background/50 p-4 sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Welcome back</p>
                <h3 className="mt-0.5 text-base font-bold sm:text-lg">
                  Workforce overview
                </h3>
              </div>

              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                AS
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {[
                {
                  label: "Employees",
                  value: "248",
                  icon: Users,
                },
                {
                  label: "Active",
                  value: "231",
                  icon: Activity,
                },
                {
                  label: "Departments",
                  value: "12",
                  icon: Building2,
                },
                {
                  label: "New hires",
                  value: "18",
                  icon: UserRoundCheck,
                },
              ].map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/70 bg-card p-3 shadow-sm"
                  >
                    <div className="mb-3 flex size-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Icon className="size-3.5" />
                    </div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold">Workforce growth</p>
                    <p className="text-[10px] text-muted-foreground">
                      Last six months
                    </p>
                  </div>

                  <Badge
                    variant="secondary"
                    className="text-[9px] text-emerald-600 dark:text-emerald-400"
                  >
                    +12.4%
                  </Badge>
                </div>

                <div className="flex h-28 items-end justify-between gap-2">
                  {[35, 48, 43, 62, 71, 88, 78, 96].map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className="group flex h-full flex-1 items-end"
                    >
                      <div
                        style={{ height: `${height}%` }}
                        className="w-full rounded-t-sm bg-linear-to-t from-indigo-600 to-violet-400 opacity-80 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                <p className="text-xs font-semibold">Employee status</p>
                <p className="text-[10px] text-muted-foreground">
                  Current workforce
                </p>

                <div className="relative mx-auto mt-4 flex size-24 items-center justify-center rounded-full bg-[conic-gradient(#4f46e5_0deg_334deg,#e5e7eb_334deg_360deg)]">
                  <div className="flex size-16 flex-col items-center justify-center rounded-full bg-card">
                    <span className="text-lg font-bold">93%</span>
                    <span className="text-[9px] text-muted-foreground">
                      Active
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-3 text-[9px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-indigo-500" />
                    Active
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                    Inactive
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <p className="text-xs font-semibold">Recent employees</p>
                  <p className="text-[10px] text-muted-foreground">
                    Recently added team members
                  </p>
                </div>

                <ChevronRight className="size-4 text-muted-foreground" />
              </div>

              <div className="divide-y">
                {employeeRows.map((employee) => (
                  <div
                    key={employee.name}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                      {employee.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-semibold">
                        {employee.name}
                      </p>
                      <p className="truncate text-[9px] text-muted-foreground">
                        {employee.department}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className="hidden text-[8px] font-medium md:inline-flex"
                    >
                      {employee.role}
                    </Badge>

                    <span className="flex items-center gap-1 text-[8px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {employee.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 top-16 hidden items-center gap-2 rounded-xl border bg-background/95 px-3 py-2 shadow-xl backdrop-blur md:flex">
        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="size-4" />
        </div>
        <div>
          <p className="text-[10px] font-semibold">Employee added</p>
          <p className="text-[9px] text-muted-foreground">
            Record saved successfully
          </p>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-xl border bg-background/95 px-3 py-2 shadow-xl backdrop-blur md:flex">
        <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
          <ShieldCheck className="size-4" />
        </div>
        <div>
          <p className="text-[10px] font-semibold">Protected access</p>
          <p className="text-[9px] text-muted-foreground">
            Role permissions enabled
          </p>
        </div>
      </div>
    </div>
  );
}
