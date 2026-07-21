import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel"
import { getCurrentUserCached } from "@/features/auth/auth.server"
import { InactiveSessionCleanup } from "@/components/auth/inactive-session-cleanup"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Login | EmpNexa",
  description: "Sign in to your EmpNexa workspace.",
}

export default async function LoginPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const reason = searchParams?.reason;
  const cleared = searchParams?.cleared;
  
  if (reason !== "inactive") {
    const user = await getCurrentUserCached();

    if (user?.role === "employee") {
      redirect("/profile");
    }

    if (user) {
      redirect("/dashboard");
    }
  }

  if (reason === "inactive" && cleared !== "1") {
    return <InactiveSessionCleanup />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <AuthBrandPanel />

      <main className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="absolute left-6 top-6 lg:hidden">
          <Link href="/">
            <Image
              src="/Images/Logo/logo_light.svg"
              alt="EmpNexa Logo"
              width={140}
              height={34}
              priority
              className="block h-8 w-auto dark:hidden"
            />
            <Image
              src="/Images/Logo/logo_dark.svg"
              alt="EmpNexa Logo"
              width={140}
              height={34}
              priority
              className="hidden h-8 w-auto dark:block"
            />
          </Link>
        </div>

        {reason === "inactive" && cleared === "1" && (
          <Alert variant="destructive" className="mb-6 w-full max-w-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Your account is inactive. Contact your administrator.
            </AlertDescription>
          </Alert>
        )}
        <LoginForm />
      </main>
    </div>
  )
}
