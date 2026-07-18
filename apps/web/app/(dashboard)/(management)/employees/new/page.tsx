import { getCurrentUserServer } from "@/features/auth/auth.server";
import { EmployeeForm } from "@/components/employees/employee-form";
import { redirect } from "next/navigation";

export default async function NewEmployeePage() {
  const user = await getCurrentUserServer();
  if (!user || user.role === "employee") {
    redirect("/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Employee</h1>
        <p className="text-muted-foreground">Fill out the form below to create a new employee profile.</p>
      </div>

      <EmployeeForm currentUserRole={user.role} />
    </div>
  );
}
