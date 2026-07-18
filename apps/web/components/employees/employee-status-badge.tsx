import { Badge } from "@/components/ui/badge";
import { EmployeeStatus } from "@empnexa/shared";

export function EmployeeStatusBadge({ status }: { status: EmployeeStatus }) {
  if (status === "active") {
    return <Badge variant="default" className="bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:text-green-400">Active</Badge>;
  }
  return <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">Inactive</Badge>;
}
