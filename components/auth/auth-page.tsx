"use client"

import { useRouter } from "next/navigation"

import { AuthFlow } from "@/components/auth/auth-flow"

export function AuthPage() {
  const router = useRouter()

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <section className="w-full max-w-sm space-y-6">
        <AuthFlow onAuthenticated={() => router.replace("/")} />
      </section>
    </main>
  )
}
