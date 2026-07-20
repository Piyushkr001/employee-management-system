import { getCurrentUserCached } from "@/features/auth/auth.server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUserCached();
  if (!user || !["super_admin", "hr_manager"].includes(user.role)) {
    redirect("/unauthorized");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Dashboard analytics go here.</p>
    </div>
  );
}
