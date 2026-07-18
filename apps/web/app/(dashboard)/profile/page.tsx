import { getCurrentUserServer } from "@/features/auth/auth.server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUserServer();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Profile</h1>
      <p>Welcome, {user.name} ({user.employeeCode})</p>
      <div className="mt-4 p-4 rounded bg-muted/30">
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Department:</strong> {user.department}</p>
        <p><strong>Designation:</strong> {user.designation}</p>
      </div>
    </div>
  );
}
