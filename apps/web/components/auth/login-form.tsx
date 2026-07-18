"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { loginSchema, LoginFormInput } from "@empnexa/shared"
import { authApi, ApiClientError } from "@/features/auth/auth.api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PasswordInput } from "./password-input"
import { DemoAccounts } from "./demo-accounts"

import { getSafeRedirect } from "@/features/auth/auth.utils"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormInput) {
    try {
      const res = await authApi.login(data)
      
      const safeRedirect = getSafeRedirect(searchParams.get("redirect"))
      const roleRedirect = (res.data?.user?.role === "super_admin" || res.data?.user?.role === "hr_manager")
        ? "/dashboard"
        : "/profile"

      router.push(safeRedirect ?? roleRedirect)
      router.refresh()
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.fieldErrors) {
          Object.entries(error.fieldErrors).forEach(([field, messages]) => {
            setError(field as any, { message: messages[0] })
          })
        } else {
          setError("root", { message: error.message })
        }
      } else {
        setError("root", { message: "An unexpected error occurred. Please try again." })
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to your EmpNexa workspace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          Sign In
        </Button>
      </form>

      <DemoAccounts 
        disabled={isSubmitting}
        onSelect={(email, password) => {
          setValue("email", email)
          setValue("password", password)
        }} 
      />
    </div>
  )
}
