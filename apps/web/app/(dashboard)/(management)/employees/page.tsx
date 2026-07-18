import { getCurrentUserServer } from "@/features/auth/auth.server";
import { employeeApi } from "@/features/employees/employee.api";
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
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await getCurrentUserServer();
  if (!user || user.role === "employee") {
    redirect("/unauthorized");
  }

  // Next.js searchParams are parsed securely, pass them to API
  const query = {
    page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit, 10) : 10,
    search: searchParams.search,
    department: searchParams.department,
    designation: searchParams.designation,
    status: searchParams.status as any,
    role: searchParams.role as any,
    sortBy: searchParams.sortBy as any,
    sortOrder: searchParams.sortOrder as any,
  };

  try {
    const res = await employeeApi.list(query);
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
          pagination={pagination} 
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        Failed to load employees. Please try again.
      </div>
    );
  }
}
