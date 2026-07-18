"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight,
    Building2,
    LayoutDashboard,
    Menu,
    Network,
    ShieldCheck,
    Users,
} from "lucide-react";

import { ModeToggle } from "./ModeToggle";
import { buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigationLinks = [
    {
        label: "Home",
        href: "/",
        icon: Building2,
    },
    {
        label: "Features",
        href: "#features",
        icon: LayoutDashboard,
    },
    {
        label: "Roles",
        href: "#roles",
        icon: ShieldCheck,
    },
    {
        label: "Hierarchy",
        href: "#hierarchy",
        icon: Network,
    },
    {
        label: "About",
        href: "#about",
        icon: Users,
    },
] as const;

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 shadow-sm backdrop-blur-xl supports-backdrop-filter:bg-background/70">
            <nav
                aria-label="Primary navigation"
                className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8"
            >
                <Link href="/">
                    <Image
                        src="/Images/Logo/logo_light.svg"
                        alt="EmpNexa Logo"
                        width={300}
                        height={72}
                        priority
                        className="block h-12 w-auto dark:hidden"
                    />
                    <Image
                        src="/Images/Logo/logo_dark.svg"
                        alt="EmpNexa Logo"
                        width={300}
                        height={72}
                        priority
                        className="hidden h-12 w-auto dark:block"
                    />
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center justify-center gap-1 lg:flex">
                    {navigationLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive(item.href) ? "page" : undefined}
                            className={cn(
                                "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                isActive(item.href)
                                    ? "bg-accent text-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop actions */}
                <div className="hidden items-center gap-2 lg:flex">
                    <ModeToggle />

                    <Link
                        href="/login"
                        className={cn(
                            buttonVariants({
                                variant: "ghost",
                                size: "sm",
                            }),
                            "font-medium",
                        )}
                    >
                        Log in
                    </Link>

                    <Link
                        href="/login"
                        className={cn(
                            buttonVariants({
                                size: "sm",
                            }),
                            "gap-2 bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:opacity-90 hover:shadow-lg",
                        )}
                    >
                        Get started
                        <ArrowRight className="size-4" />
                    </Link>
                </div>

                {/* Mobile actions */}
                <div className="flex items-center gap-1 lg:hidden">
                    <ModeToggle />

                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger
                            aria-label="Open navigation menu"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "icon",
                                }),
                                "rounded-full",
                            )}
                        >
                            <Menu className="size-5" />
                            <span className="sr-only">Open navigation menu</span>
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="flex w-[88%] max-w-sm flex-col border-l bg-background p-0"
                        >
                            <SheetHeader className="border-b px-5 py-5 text-left">
                                <SheetTitle className="sr-only">
                                    EmpNexa navigation menu
                                </SheetTitle>


                            </SheetHeader>

                            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
                                <div className="flex flex-col gap-2">
                                    {navigationLinks.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={closeMobileMenu}
                                                aria-current={active ? "page" : undefined}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                    active
                                                        ? "bg-accent text-foreground"
                                                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "flex size-9 items-center justify-center rounded-lg transition-colors",
                                                        active
                                                            ? "bg-indigo-500/20 text-indigo-600"
                                                            : "bg-indigo-500/10 text-indigo-600",
                                                    )}
                                                >
                                                    <Icon className="size-4" />
                                                </span>

                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="mt-auto flex flex-col gap-3 border-t pt-6">
                                    <Link
                                        href="/login"
                                        onClick={closeMobileMenu}
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                                size: "lg",
                                            }),
                                            "w-full",
                                        )}
                                    >
                                        Log in
                                    </Link>

                                    <Link
                                        href="/login"
                                        onClick={closeMobileMenu}
                                        className={cn(
                                            buttonVariants({
                                                size: "lg",
                                            }),
                                            "w-full gap-2 bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 hover:opacity-90",
                                        )}
                                    >
                                        Get started
                                        <ArrowRight className="size-4" />
                                    </Link>

                                    <p className="pt-2 text-center text-xs leading-5 text-muted-foreground">
                                        Secure employee management for modern organizations.
                                    </p>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}