import { Badge } from "@/components/ui/badge";
import { UserRole } from "@empnexa/shared";

export function EmployeeRoleBadge({ role }: { role: UserRole }) {
  switch (role) {
    case "super_admin":
      return <Badge variant="default" className="bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 dark:text-purple-400">Super Admin</Badge>;
    case "hr_manager":
      return <Badge variant="default" className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:text-blue-400">HR Manager</Badge>;
    default:
      return <Badge variant="outline" className="text-muted-foreground">Employee</Badge>;
  }
}
