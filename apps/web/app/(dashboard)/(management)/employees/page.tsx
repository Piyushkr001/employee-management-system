import { getCurrentUserCached } from "@/features/auth/auth.server";
import { getEmployeesServer } from "@/features/employees/employee.server";
import { employeeListQuerySchema, EmployeeListQuery, PaginationMetadata } from "@empnexa/shared";
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

  function firstValue(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
  }

  const rawQuery = {
    page: firstValue(resolvedSearchParams.page),
    limit: firstValue(resolvedSearchParams.limit),
    search: firstValue(resolvedSearchParams.search),
    department: firstValue(resolvedSearchParams.department),
    designation: firstValue(resolvedSearchParams.designation),
    status: firstValue(resolvedSearchParams.status),
    role: firstValue(resolvedSearchParams.role),
    managerId: firstValue(resolvedSearchParams.managerId),
    sortBy: firstValue(resolvedSearchParams.sortBy),
    sortOrder: firstValue(resolvedSearchParams.sortOrder),
  };

  const validQuery: Partial<EmployeeListQuery> = {};
  for (const [key, value] of Object.entries(rawQuery)) {
    if (value !== undefined) {
      const fieldSchema = (employeeListQuerySchema.shape as Record<string, any>)[key];
      if (fieldSchema) {
        const result = fieldSchema.safeParse(value);
        if (result.success) {
          (validQuery as any)[key] = result.data;
        }
      }
    }
  }

  const query = employeeListQuerySchema.parse(validQuery);

  const res = await getEmployeesServer(query);
  const { employees, pagination } = res.data || { employees: [], pagination: { page: 1, total: 0, totalPages: 1 } };

  if (pagination.total > 0 && query.page > pagination.totalPages) {
    const newSearchParams = new URLSearchParams(resolvedSearchParams as Record<string, string>);
    newSearchParams.set("page", pagination.totalPages.toString());
    redirect(`/employees?${newSearchParams.toString()}`);
  }

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
        currentUserId={user.id}
        pagination={pagination as PaginationMetadata} 
      />
    </div>
  );
}
