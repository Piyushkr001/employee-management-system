"use client"

import { ModeToggle } from "@/app/_shared/ModeToggle"
import { MobileSidebar } from "./mobile-sidebar"
import { UserMenu } from "./user-menu"
import { AuthenticatedUser } from "@empnexa/shared"

export function DashboardHeader({ user }: { user: AuthenticatedUser }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <MobileSidebar user={user} />
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold tracking-tight hidden md:block">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
