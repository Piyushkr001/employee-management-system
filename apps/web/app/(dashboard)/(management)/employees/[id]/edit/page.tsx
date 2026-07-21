import { getCurrentUserCached } from "@/features/auth/auth.server";
import { getEmployeeByIdServer } from "@/features/employees/employee.server";
import { EditEmployeeForm } from "@/components/employees/edit-employee-form";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EmployeeDto } from "@empnexa/shared";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const user = await getCurrentUserCached();
  if (!user || user.role === "employee") {
    redirect("/unauthorized");
  }

  let employee: EmployeeDto;

  try {
    const res = await getEmployeeByIdServer(resolvedParams.id);
    if (!res.data) {
      notFound();
    }
    employee = res.data;
  } catch (error: any) {
    if (error?.payload?.error?.code === "EMPLOYEE_NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  // Basic frontend check. Backend will strictly enforce.
  if (user.role === "hr_manager" && employee.role === "super_admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/employees/${employee.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Employee</h1>
          <p className="text-muted-foreground">Updating details for {employee.name} ({employee.employeeCode})</p>
        </div>
      </div>

      <EditEmployeeForm employee={employee} currentUserRole={user.role} />
    </div>
  );
}
