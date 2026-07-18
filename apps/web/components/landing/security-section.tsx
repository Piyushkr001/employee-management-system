import { LockKeyhole, ShieldCheck } from "lucide-react";
import { securityItems } from "@/data/landing";

export function SecuritySection() {
  return (
    <section id="security" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[32px_32px]"
          />

          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 -z-10 size-96 rounded-full bg-indigo-500/20 blur-[100px]"
          />

          <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
                <LockKeyhole className="size-4 text-indigo-400" />
                Enterprise-grade security
              </div>

              <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your workforce data, protected.
              </h2>

              <p className="mt-5 max-w-xl text-pretty leading-7 text-zinc-400 sm:text-lg">
                EmpNexa is built with security first. From password hashing
                to protected API endpoints and strictly enforced permissions.
              </p>
            </div>

            <div className="w-full flex-1 sm:max-w-md lg:max-w-none lg:shrink-0">
              <div className="grid gap-4 sm:grid-cols-2">
                {securityItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm font-medium text-zinc-200 shadow-sm backdrop-blur transition-colors hover:bg-zinc-800/80"
                  >
                    <ShieldCheck className="size-4 shrink-0 text-indigo-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
