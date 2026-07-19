import { getCurrentUserCached } from "@/features/auth/auth.server";
import { getEmployeesServer } from "@/features/employees/employee.server";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeSearch } from "@/components/employees/employee-search";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUserCached();
  if (!user || user.role === "employee") {
    redirect("/unauthorized");
  }

  const query = {
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1,
    limit: resolvedSearchParams.limit ? parseInt(resolvedSearchParams.limit, 10) : 10,
    search: resolvedSearchParams.search,
    department: resolvedSearchParams.department,
    designation: resolvedSearchParams.designation,
    status: resolvedSearchParams.status,
    role: resolvedSearchParams.role,
    sortBy: resolvedSearchParams.sortBy,
    sortOrder: resolvedSearchParams.sortOrder,
  };

  const res = await getEmployeesServer(query);
  const { employees, pagination } = res.data || { employees: [], pagination: { page: 1, total: 0, totalPages: 1 } };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your organization's workforce.</p>
        </div>
        
        <Link href="/employees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <EmployeeSearch />
        <EmployeeFilters />
      </div>

      <EmployeeTable 
        employees={employees} 
        currentUserRole={user.role} 
        pagination={pagination as any} 
      />
    </div>
  );
}
