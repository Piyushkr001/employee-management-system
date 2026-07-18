import { redirect } from "next/navigation";
import { getCurrentUserServer } from "@/features/auth/auth.server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserServer();

  if (!user || user.role === "employee") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
