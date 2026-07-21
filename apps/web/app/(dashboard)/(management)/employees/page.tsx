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

type EmployeeSearchParams = Record<string, string | string[] | undefined>;

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<EmployeeSearchParams>;
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
  
  if (rawQuery.page !== undefined) {
    const res = employeeListQuerySchema.shape.page.safeParse(rawQuery.page);
    if (res.success) validQuery.page = res.data;
  }
  if (rawQuery.limit !== undefined) {
    const res = employeeListQuerySchema.shape.limit.safeParse(rawQuery.limit);
    if (res.success) validQuery.limit = res.data;
  }
  if (rawQuery.search !== undefined) {
    const res = employeeListQuerySchema.shape.search.safeParse(rawQuery.search);
    if (res.success) validQuery.search = res.data;
  }
  if (rawQuery.department !== undefined) {
    const res = employeeListQuerySchema.shape.department.safeParse(rawQuery.department);
    if (res.success) validQuery.department = res.data;
  }
  if (rawQuery.designation !== undefined) {
    const res = employeeListQuerySchema.shape.designation.safeParse(rawQuery.designation);
    if (res.success) validQuery.designation = res.data;
  }
  if (rawQuery.status !== undefined) {
    const res = employeeListQuerySchema.shape.status.safeParse(rawQuery.status);
    if (res.success) validQuery.status = res.data;
  }
  if (rawQuery.role !== undefined) {
    const res = employeeListQuerySchema.shape.role.safeParse(rawQuery.role);
    if (res.success) validQuery.role = res.data;
  }
  if (rawQuery.managerId !== undefined) {
    const res = employeeListQuerySchema.shape.managerId.safeParse(rawQuery.managerId);
    if (res.success) validQuery.managerId = res.data;
  }
  if (rawQuery.sortBy !== undefined) {
    const res = employeeListQuerySchema.shape.sortBy.safeParse(rawQuery.sortBy);
    if (res.success) validQuery.sortBy = res.data;
  }
  if (rawQuery.sortOrder !== undefined) {
    const res = employeeListQuerySchema.shape.sortOrder.safeParse(rawQuery.sortOrder);
    if (res.success) validQuery.sortOrder = res.data;
  }

  const query = employeeListQuerySchema.parse(validQuery);

  const res = await getEmployeesServer(query);
  const { employees, pagination } = res.data || { employees: [], pagination: { page: 1, total: 0, totalPages: 1 } };

  if (pagination.total > 0 && query.page > pagination.totalPages) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(validQuery)) {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    }
    params.set("page", pagination.totalPages.toString());
    redirect(`/employees?${params.toString()}`);
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
