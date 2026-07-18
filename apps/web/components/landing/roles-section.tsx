import { ShieldCheck, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { roles } from "@/data/landing";

export function RolesSection() {
  return (
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
  );
}
