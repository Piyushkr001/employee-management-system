import { getCurrentUserServer } from "@/features/auth/auth.server";
import { employeeApi } from "@/features/employees/employee.api";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/employees/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeRoleBadge } from "@/components/employees/employee-role-badge";

export default async function ProfilePage() {
  const user = await getCurrentUserServer();
  if (!user) {
    redirect("/login");
  }

  // Fetch latest data to ensure we have phone and profile image url
  let employeeData = null;
  try {
    const res = await employeeApi.getById(user.id);
    employeeData = res.data;
  } catch (error) {
    // Graceful fallback to user context if API fails
    employeeData = user as any;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Welcome, {user.name} ({user.employeeCode})</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{employeeData?.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="mt-1"><EmployeeRoleBadge role={employeeData?.role} /></div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Department</div>
                <div className="font-medium">{employeeData?.department}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Designation</div>
                <div className="font-medium">{employeeData?.designation}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {employeeData && <ProfileForm initialData={employeeData} />}
      </div>
    </div>
  );
}
