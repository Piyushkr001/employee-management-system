import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { hierarchyMembers } from "@/data/landing";

export function OrganizationPreview() {
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
