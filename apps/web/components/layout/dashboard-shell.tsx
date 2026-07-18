import { AppSidebar } from "./app-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { AuthenticatedUser } from "@empnexa/shared"
import Image from "next/image"
import Link from "next/link"

interface DashboardShellProps {
  user: AuthenticatedUser
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/20 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                src="/Images/Logo/logo_light.svg"
                alt="EmpNexa"
                width={120}
                height={28}
                className="block h-7 w-auto dark:hidden"
              />
              <Image
                src="/Images/Logo/logo_dark.svg"
                alt="EmpNexa"
                width={120}
                height={28}
                className="hidden h-7 w-auto dark:block"
              />
            </Link>
          </div>
          <div className="flex-1">
            <AppSidebar user={user} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <DashboardHeader user={user} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
