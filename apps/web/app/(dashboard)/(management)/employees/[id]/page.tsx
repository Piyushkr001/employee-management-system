import { getCurrentUserCached } from "@/features/auth/auth.server";
import { getEmployeeByIdServer } from "@/features/employees/employee.server";
import { redirect, notFound } from "next/navigation";
import { EmployeeStatusBadge } from "@/components/employees/employee-status-badge";
import { EmployeeRoleBadge } from "@/components/employees/employee-role-badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeDto } from "@/features/employees/employee.api";

export default async function EmployeeDetailsPage({
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
              {employee.salary !== undefined && employee.salary !== null && (
                <div>
                  <div className="text-sm text-muted-foreground">Salary</div>
                  <div className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(employee.salary)}
                  </div>
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
}
