import { Button } from "@/components/ui/button"

interface DemoAccountsProps {
  onSelect: (email: string, pass: string) => void
  disabled?: boolean
}

const accounts = [
  {
    role: "Super Admin",
    email: "admin@empnexa.com",
    pass: "Admin@123",
  },
  {
    role: "HR Manager",
    email: "hr@empnexa.com",
    pass: "HrManager@123",
  },
  {
    role: "Employee",
    email: "employee@empnexa.com",
    pass: "Employee@123",
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
