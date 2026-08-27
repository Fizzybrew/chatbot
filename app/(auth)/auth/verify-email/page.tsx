"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { OtpForm } from "@/components/auth/otp-form"

const AUTH_EMAIL_STORAGE_KEY = "auth:verification-email"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const storedEmail = sessionStorage.getItem(AUTH_EMAIL_STORAGE_KEY)

    if (!storedEmail) {
      router.replace("/auth")
      return
    }

    setEmail(storedEmail)
  }, [router])

  if (!email) {
    return null
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col items-center gap-8">
        <header className="w-full space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to {email}.
          </p>
        </header>

        <OtpForm email={email} />
      </section>
    </main>
  )
}
