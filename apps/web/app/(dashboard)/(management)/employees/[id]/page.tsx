import { getCurrentUserServer } from "@/features/auth/auth.server";
import { employeeApi } from "@/features/employees/employee.api";
import { redirect } from "next/navigation";
import { EmployeeStatusBadge } from "@/components/employees/employee-status-badge";
import { EmployeeRoleBadge } from "@/components/employees/employee-role-badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EmployeeDetailsPage({
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

    const canEdit = user.role === "super_admin" || (user.role === "hr_manager" && employee.role !== "super_admin");

    return (
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center gap-4">
          <Link href="/employees">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
            <p className="text-muted-foreground">{employee.designation}</p>
          </div>
          {canEdit && (
            <Link href={`/employees/${employee.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Employee Code</div>
                  <div className="font-medium">{employee.employeeCode}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="mt-1"><EmployeeStatusBadge status={employee.status as any} /></div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{employee.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{employee.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Role</div>
                  <div className="mt-1"><EmployeeRoleBadge role={employee.role} /></div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Manager</div>
                  <div className="font-medium">
                    {employee.manager ? `${employee.manager.name} (${employee.manager.employeeCode})` : "None"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Department</div>
                  <div className="font-medium">{employee.department}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Designation</div>
                  <div className="font-medium">{employee.designation}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Joining Date</div>
                  <div className="font-medium">{employee.joiningDate}</div>
                </div>
                {employee.salary && (
                  <div>
                    <div className="text-sm text-muted-foreground">Salary</div>
                    <div className="font-medium">₹{employee.salary.toLocaleString()}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">Created At</div>
                  <div className="font-medium">{new Date(employee.createdAt!).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div className="font-medium">{new Date(employee.updatedAt!).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        Failed to load employee details or employee not found.
      </div>
    );
  }
}
