import { getCurrentUserServer } from "@/features/auth/auth.server";
import { employeeApi } from "@/features/employees/employee.api";
import { EmployeeForm } from "@/components/employees/employee-form";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditEmployeePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUserServer();
  if (!user || user.role === "employee") {
    redirect("/unauthorized");
  }

  try {
    const res = await employeeApi.getById(params.id);
    const employee = res.data!;

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

        <EmployeeForm initialData={employee} currentUserRole={user.role} />
      </div>
    );
  } catch (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        Failed to load employee data for editing.
      </div>
    );
  }
}
