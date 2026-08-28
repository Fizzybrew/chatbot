"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(searchParams.get("token"))
  }, [searchParams])

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col items-center gap-8">
        <header className="w-full space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Choose a new password</h1>
          <p className="text-sm text-muted-foreground">
            Use at least 8 characters for your new password.
          </p>
        </header>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="text-center text-sm text-destructive">
            This reset link is invalid or expired. Request a new one.
          </p>
        )}
      </section>
    </main>
  )
}
