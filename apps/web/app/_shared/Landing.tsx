import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Database,
  GitBranch,
  LayoutDashboard,
  LockKeyhole,
  Network,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCog,
  UserRoundCheck,
  Users,
  Zap,
} from "lucide-react";


import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type Role = {
  name: string;
  description: string;
  icon: LucideIcon;
  permissions: string[];
};

const platformHighlights = [
  {
    label: "Secure authentication",
    icon: LockKeyhole,
  },
  {
    label: "Role-based access",
    icon: ShieldCheck,
  },
  {
    label: "Employee management",
    icon: Users,
  },
  {
    label: "Reporting hierarchy",
    icon: GitBranch,
  },
];

const features: Feature[] = [
  {
    title: "Employee management",
    description:
      "Create, update, search and manage employee records from a centralized and intuitive workspace.",
    icon: Users,
  },
  {
    title: "Role-based access",
    description:
      "Protect sensitive operations with dedicated permissions for Super Admins, HR Managers and Employees.",
    icon: ShieldCheck,
  },
  {
    title: "Organization hierarchy",
    description:
      "Assign reporting managers, display direct reports and visualize your complete organizational structure.",
    icon: Network,
  },
  {
    title: "Workforce analytics",
    description:
      "Track total employees, workforce status, departments and organizational trends from a focused dashboard.",
    icon: BarChart3,
  },
  {
    title: "Powerful discovery",
    description:
      "Find employees quickly using search, department, role and status filters with flexible sorting.",
    icon: Search,
  },
  {
    title: "Secure employee data",
    description:
      "Keep workforce information protected with JWT authentication, password hashing and validated APIs.",
    icon: Database,
  },
];

const roles: Role[] = [
  {
    name: "Super Admin",
    description:
      "Complete organizational control for system administrators and business owners.",
    icon: UserCog,
    permissions: [
      "Manage all employee records",
      "Assign roles and reporting managers",
      "Delete or deactivate employees",
      "Access workforce analytics",
    ],
  },
  {
    name: "HR Manager",
    description:
      "Focused employee operations and workforce administration for HR teams.",
    icon: BriefcaseBusiness,
    permissions: [
      "Create and edit employees",
      "View organization records",
      "Assign reporting managers",
      "Manage employee lifecycle",
    ],
  },
  {
    name: "Employee",
    description:
      "A secure self-service experience that keeps individual employees connected.",
    icon: CircleUserRound,
    permissions: [
      "View personal profile",
      "Update permitted information",
      "View reporting manager",
      "Access role-specific workspace",
    ],
  },
];

const securityItems = [
  "JWT-based protected sessions",
  "bcrypt password hashing",
  "Backend permission enforcement",
  "Frontend and backend validation",
  "Protected routes and APIs",
  "Circular reporting prevention",
];

const employeeRows = [
  {
    initials: "AK",
    name: "Aarav Kumar",
    department: "Engineering",
    role: "Employee",
    status: "Active",
  },
  {
    initials: "SM",
    name: "Sara Mehta",
    department: "Human Resources",
    role: "HR Manager",
    status: "Active",
  },
  {
    initials: "RV",
    name: "Rohan Verma",
    department: "Product",
    role: "Employee",
    status: "Active",
  },
];

const hierarchyMembers = [
  {
    initials: "AS",
    name: "Ananya Sharma",
    role: "Super Admin",
    className:
      "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  {
    initials: "RM",
    name: "Rahul Mehta",
    role: "HR Manager",
    className:
      "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  {
    initials: "PK",
    name: "Priya Kapoor",
    role: "Engineering Lead",
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
];

function DashboardPreview() {
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

function OrganizationPreview() {
  return (
    <div className="relative rounded-[2rem] border border-border/70 bg-card/80 p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-8">
      <div className="absolute inset-x-16 top-20 -z-10 h-32 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="mx-auto flex max-w-xl flex-col items-center">
        <div
          className={cn(
            "flex w-full max-w-xs items-center gap-3 rounded-2xl border p-4 shadow-sm",
            hierarchyMembers[0].className,
          )}
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-sm font-bold shadow-sm">
            {hierarchyMembers[0].initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {hierarchyMembers[0].name}
            </p>
            <p className="text-xs opacity-80">{hierarchyMembers[0].role}</p>
          </div>

          <Badge variant="secondary" className="ml-auto text-[9px]">
            Root
          </Badge>
        </div>

        <div className="h-8 w-px bg-linear-to-b from-indigo-500 to-violet-500" />

        <div className="h-px w-[65%] bg-linear-to-r from-transparent via-violet-500 to-transparent" />

        <div className="grid w-full grid-cols-1 gap-4 pt-8 sm:grid-cols-2">
          {hierarchyMembers.slice(1).map((member) => (
            <div
              key={member.name}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl border p-4 shadow-sm",
                member.className,
              )}
            >
              <span className="absolute -top-8 left-1/2 h-8 w-px -translate-x-1/2 bg-violet-500 sm:block" />

              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-xs font-bold shadow-sm">
                {member.initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{member.name}</p>
                <p className="truncate text-xs opacity-80">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {["Developer", "Designer", "Recruiter", "Analyst"].map(
            (designation, index) => (
              <div
                key={designation}
                className="rounded-xl border bg-background/80 p-3 text-center shadow-sm"
              >
                <div className="mx-auto mb-2 flex size-7 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                  {["AK", "NM", "SK", "RV"][index]}
                </div>
                <p className="truncate text-[10px] font-semibold">
                  {designation}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">

      <main>
        {/* Hero */}
        <section
          id="home"
          className="relative isolate scroll-mt-24 overflow-hidden"
        >
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
                  href="#features"
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

        {/* Capability strip */}
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

        {/* Features */}
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

        {/* Analytics section */}
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

        {/* Roles */}
        <section
          id="roles"
          className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <Badge variant="secondary" className="mb-4 rounded-full">
                  Role-based experience
                </Badge>

                <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  The right level of access for every role
                </h2>

                <p className="mt-5 max-w-2xl text-pretty leading-7 text-muted-foreground sm:text-lg">
                  EmpNexa gives each person the tools they need while protecting
                  sensitive employee and organizational information.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-600" />
                Permissions enforced securely
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {roles.map((role, index) => {
                const Icon = role.icon;

                return (
                  <Card
                    key={role.name}
                    className={cn(
                      "relative overflow-hidden border-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                      index === 0 &&
                        "border-indigo-500/30 bg-linear-to-b from-indigo-500/10 to-card shadow-lg shadow-indigo-500/10",
                    )}
                  >
                    {index === 0 && (
                      <Badge className="absolute right-4 top-4 bg-indigo-600 text-white">
                        Full access
                      </Badge>
                    )}

                    <CardHeader className="pb-4">
                      <div className="mb-5 flex size-13 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20">
                        <Icon className="size-6" />
                      </div>

                      <CardTitle className="text-2xl">{role.name}</CardTitle>
                      <CardDescription className="leading-6">
                        {role.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <Separator className="mb-5" />

                      <div className="flex flex-col gap-3">
                        {role.permissions.map((permission) => (
                          <div
                            key={permission}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <Check className="size-3" />
                            </span>

                            <span className="text-muted-foreground">
                              {permission}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Hierarchy */}
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

        {/* Security */}
        <section
          id="about"
          className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-12 text-white shadow-2xl shadow-indigo-500/15 sm:px-10 sm:py-16 lg:px-16">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.9),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.75),transparent_35%)]"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[44px_44px]"
              />

              <div className="relative flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
                <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
                    <LockKeyhole className="size-6 text-indigo-300" />
                  </div>

                  <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    Security built into every workforce operation
                  </h2>

                  <p className="mt-5 max-w-2xl text-pretty leading-7 text-slate-300 sm:text-lg">
                    EmpNexa combines secure authentication, carefully enforced
                    permissions and data validation to protect employee
                    information throughout the platform.
                  </p>
                </div>

                <div className="grid w-full flex-1 gap-3 sm:grid-cols-2">
                  {securityItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-slate-200 backdrop-blur"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                        <Check className="size-3.5" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28">
          <div className="mx-auto w-full max-w-5xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-indigo-500/20 bg-linear-to-br from-indigo-500/10 via-violet-500/5 to-blue-500/10 px-5 py-12 text-center shadow-xl shadow-indigo-500/10 sm:px-12 sm:py-16">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 -z-10 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl"
              />

              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="size-6" />
              </div>

              <h2 className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Bring clarity to your employee operations
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-pretty leading-7 text-muted-foreground sm:text-lg">
                Use EmpNexa to securely manage employee information, reporting
                relationships and role-based workflows from one unified
                platform.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                    }),
                    "h-12 w-full gap-2 rounded-xl bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 px-7 text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 sm:w-auto",
                  )}
                >
                  Get started
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="#features"
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    }),
                    "h-12 w-full rounded-xl bg-background/70 px-7 sm:w-auto",
                  )}
                >
                  View capabilities
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}