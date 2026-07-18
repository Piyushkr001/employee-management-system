import Image from "next/image"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export function AuthBrandPanel() {
  return (
    <div className="relative hidden w-full flex-col justify-between bg-zinc-950 p-10 lg:flex lg:max-w-[500px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[32px_32px]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-20 top-20 -z-10 size-96 rounded-full bg-indigo-500/20 blur-[100px]"
      />

      <div className="z-10 flex flex-col items-start">
        <Link href="/">
          <Image
            src="/Images/Logo/logo_dark.svg"
            alt="EmpNexa Logo"
            width={180}
            height={44}
            priority
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <div className="z-10 mt-auto">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-white">
          Manage people. Build better teams.
        </h1>
        <p className="mt-4 text-pretty text-lg text-zinc-400">
          EmpNexa provides a secure, role-based workspace for your organization&apos;s records, structure, and insights.
        </p>

        <ul className="mt-8 flex flex-col gap-4 text-zinc-300">
          <li className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-indigo-400" />
            <span>Role-based access control</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-indigo-400" />
            <span>Centralized employee directory</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-indigo-400" />
            <span>Secure workforce analytics</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
