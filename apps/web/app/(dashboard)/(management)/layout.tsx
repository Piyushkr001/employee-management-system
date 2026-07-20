import { redirect } from "next/navigation";
import { getCurrentUserCached } from "@/features/auth/auth.server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserCached();

  if (!user || user.role === "employee") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
