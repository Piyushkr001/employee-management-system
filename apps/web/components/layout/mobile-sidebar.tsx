"use client"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "./app-sidebar"
import { AuthenticatedUserDto } from "@empnexa/shared"
import Image from "next/image"

export function MobileSidebar({ user }: { user: AuthenticatedUserDto }) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" className="shrink-0 md:hidden" />}>
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <SheetHeader className="border-b px-6 py-4 text-left">
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
          <div className="flex items-center gap-2 font-semibold">
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
          </div>
        </SheetHeader>
        <AppSidebar user={user} />
      </SheetContent>
    </Sheet>
  )
}
