"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Building2, LayoutDashboard, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthenticatedUserDto } from "@empnexa/shared"

type AppSidebarProps = {
  user: AuthenticatedUserDto
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      allowedRoles: ["super_admin", "hr_manager"],
    },
    {
      title: "Employees",
      href: "/employees",
      icon: Users,
      allowedRoles: ["super_admin", "hr_manager"],
    },
    {
      title: "Organization",
      href: "/organization",
      icon: Building2,
      allowedRoles: ["super_admin", "hr_manager"],
    },
    {
      title: "Profile",
      href: "/profile",
      icon: UserCircle,
      allowedRoles: ["super_admin", "hr_manager", "employee"],
    },
  ]

  const visibleNavItems = navItems.filter(item => item.allowedRoles.includes(user.role))

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-primary",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="size-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
