import { getCurrentUserServer } from "@/features/auth/auth.server";
import { redirect } from "next/navigation";

export default async function OrganizationPage() {
  const user = await getCurrentUserServer();
  if (!user || !["super_admin", "hr_manager"].includes(user.role)) {
    redirect("/unauthorized");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Organization</h1>
      <p className="mt-2 text-muted-foreground">View organization hierarchy here.</p>
    </div>
  );
}
