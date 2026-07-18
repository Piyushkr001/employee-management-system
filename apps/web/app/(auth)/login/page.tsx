import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel"

export const metadata: Metadata = {
  title: "Login | EmpNexa",
  description: "Sign in to your EmpNexa workspace.",
}

export default function LoginPage() {
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

        <LoginForm />
      </main>
    </div>
  )
}
