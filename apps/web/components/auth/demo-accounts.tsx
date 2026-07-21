import { Button } from "@/components/ui/button"

interface DemoAccountsProps {
  onSelect: (email: string, pass: string) => void
  disabled?: boolean
}

import { DEMO_ACCOUNTS } from "@empnexa/shared"

const accounts = [
  {
    role: "Super Admin",
    email: DEMO_ACCOUNTS.SUPER_ADMIN.email,
    pass: DEMO_ACCOUNTS.SUPER_ADMIN.password,
  },
  {
    role: "HR Manager",
    email: DEMO_ACCOUNTS.HR_MANAGER.email,
    pass: DEMO_ACCOUNTS.HR_MANAGER.password,
  },
  {
    role: "Employee",
    email: DEMO_ACCOUNTS.EMPLOYEE.email,
    pass: DEMO_ACCOUNTS.EMPLOYEE.password,
  },
]

export function DemoAccounts({ onSelect, disabled }: DemoAccountsProps) {
  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="mt-8 rounded-xl border border-dashed border-border/60 bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Demo Accounts</h4>
        <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
          Development Only
        </span>
      </div>
      
      <div className="flex flex-col gap-2">
        {accounts.map((acc) => (
          <Button
            key={acc.email}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="h-auto justify-start py-2 font-normal"
            onClick={() => onSelect(acc.email, acc.pass)}
          >
            <div className="flex flex-col items-start gap-0.5 text-left">
              <span className="text-xs font-semibold">{acc.role}</span>
              <span className="text-xs text-muted-foreground">{acc.email}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
