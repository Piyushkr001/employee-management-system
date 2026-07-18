"use client"
import Link from "next/link";
import {
    ArrowRight,
    ArrowUp,
    CheckCircle2,
    LockKeyhole,
    Mail,
    Network,
    ShieldCheck,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";

const platformLinks = [
    {
        label: "Features",
        href: "/#features",
    },
    {
        label: "User roles",
        href: "/#roles",
    },
    {
        label: "Organization hierarchy",
        href: "/#hierarchy",
    },
    {
        label: "Security",
        href: "/#security",
    },
];

const workspaceLinks = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Employees",
        href: "/employees",
    },
    {
        label: "Organization",
        href: "/organization",
    },
    {
        label: "My profile",
        href: "/profile",
    },
];

const accessLinks = [
    {
        label: "Super Admin",
        href: "/#roles",
    },
    {
        label: "HR Manager",
        href: "/#roles",
    },
    {
        label: "Employee",
        href: "/#roles",
    },
    {
        label: "Log in",
        href: "/login",
    },
];

const socialLinks = [
    {
        label: "GitHub",
        href: "https://github.com/your-username",
        icon: GithubLogoIcon,
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/your-profile",
        icon: LinkedinLogoIcon,
    },
    {
        label: "Email",
        href: "mailto:[EMAIL_ADDRESS]",
        icon: Mail,
    },
];

export function Footer() {
    return (
        <footer className="relative mt-auto overflow-hidden border-t border-border/70 bg-background">
            {/* Background decoration */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20 bg-linear-to-b from-background via-muted/20 to-muted/50"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 top-20 -z-10 size-80 rounded-full bg-indigo-500/10 blur-[100px]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 bottom-0 -z-10 size-80 rounded-full bg-violet-500/10 blur-[100px]"
            />

            <div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
                {/* CTA panel */}
                <div className="relative -mt-px overflow-hidden rounded-b-[2rem] border-x border-b border-indigo-500/20 bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 px-5 py-8 text-white shadow-xl shadow-indigo-500/15 sm:px-8 sm:py-10 lg:px-12">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:36px_36px]"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute right-0 top-0 size-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/20 blur-3xl"
                    />

                    <div className="relative flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
                        <div className="max-w-2xl">
                            <Badge className="mb-4 border-white/20 bg-white/10 text-white hover:bg-white/10">
                                <ShieldCheck className="mr-1.5 size-3.5" />
                                Secure employee management
                            </Badge>

                            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                                Build a more connected and organized workforce.
                            </h2>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                                Manage employee records, reporting relationships, permissions
                                and workforce insights from one secure workspace.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Link
                                href="/login"
                                className={cn(
                                    buttonVariants({
                                        size: "lg",
                                    }),
                                    "h-11 w-full gap-2 rounded-xl bg-white px-6 text-indigo-700 shadow-lg hover:bg-indigo-50 sm:w-auto",
                                )}
                            >
                                Access EmpNexa
                                <ArrowRight className="size-4" />
                            </Link>

                            <Link
                                href="/#features"
                                className={cn(
                                    buttonVariants({
                                        variant: "outline",
                                        size: "lg",
                                    }),
                                    "h-11 w-full rounded-xl border-white/30 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/20 hover:text-white sm:w-auto",
                                )}
                            >
                                Explore features
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main footer */}
                <div className="flex flex-col gap-12 py-12 lg:flex-row lg:justify-between lg:gap-16 lg:py-16">
                    {/* Brand */}
                    <div className="flex max-w-md flex-col items-start">
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

                        <p className="mt-5 text-sm leading-7 text-muted-foreground">
                            EmpNexa is a secure employee management platform for managing
                            workforce records, role-based permissions, reporting structures
                            and organizational insights.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            <Badge
                                variant="outline"
                                className="gap-1.5 rounded-full bg-background/70"
                            >
                                <LockKeyhole className="size-3" />
                                JWT secured
                            </Badge>

                            <Badge
                                variant="outline"
                                className="gap-1.5 rounded-full bg-background/70"
                            >
                                <Users className="size-3" />
                                Role based
                            </Badge>

                            <Badge
                                variant="outline"
                                className="gap-1.5 rounded-full bg-background/70"
                            >
                                <Network className="size-3" />
                                Hierarchy ready
                            </Badge>
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                            {socialLinks.map((item) => {
                                const Icon = item.icon;
                                const isExternal = item.href.startsWith("http");

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noreferrer" : undefined}
                                        aria-label={item.label}
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                                size: "icon",
                                            }),
                                            "rounded-full bg-background/70 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400",
                                        )}
                                    >
                                        <Icon className="size-4" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:max-w-2xl">
                        <FooterLinkGroup title="Platform" links={platformLinks} />

                        <FooterLinkGroup title="Workspace" links={workspaceLinks} />

                        <FooterLinkGroup title="Access" links={accessLinks} />
                    </div>
                </div>

                <Separator />

                {/* Status row */}
                <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:justify-start">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                            </span>
                            All systems operational
                        </span>

                        <span className="hidden h-4 w-px bg-border sm:block" />

                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            Secure and validated
                        </span>
                    </div>

                    <Link
                        href="/#home"
                        aria-label="Return to the top of the page"
                        className="group mx-auto flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:mx-0"
                    >
                        Back to top

                        <span className="flex size-8 items-center justify-center rounded-full border bg-background transition-all group-hover:-translate-y-0.5 group-hover:border-indigo-500/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            <ArrowUp className="size-3.5" />
                        </span>
                    </Link>
                </div>

                <Separator />

                {/* Copyright */}
                <div className="flex flex-col items-center justify-between gap-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
                    <p>
                        © {new Date().getFullYear()} EmpNexa. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        <Link
                            href="/privacy"
                            className="transition-colors hover:text-foreground"
                        >
                            Privacy
                        </Link>

                        <Link
                            href="/terms"
                            className="transition-colors hover:text-foreground"
                        >
                            Terms
                        </Link>

                        <Link
                            href="/security"
                            className="transition-colors hover:text-foreground"
                        >
                            Security
                        </Link>
                    </div>

                    <p className="flex items-center gap-1.5">
                        <ShieldCheck className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                        Manage people. Build better teams.
                    </p>
                </div>
            </div>
        </footer>
    );
}

type FooterLinkGroupProps = {
    title: string;
    links: {
        label: string;
        href: string;
    }[];
};

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
    return (
        <div className="flex flex-col items-start">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>

            <div className="mt-4 flex flex-col items-start gap-3">
                {links.map((link) => (
                    <Link
                        key={`${title}-${link.label}`}
                        href={link.href}
                        className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                        <span>{link.label}</span>

                        <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                ))}
            </div>
        </div>
    );
}