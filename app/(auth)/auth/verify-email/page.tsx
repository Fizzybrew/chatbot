import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { OtpForm } from "@/components/auth/otp-form"

const AUTH_VERIFICATION_EMAIL_COOKIE = "auth_verification_email"

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@")
  if (!localPart || !domain) return email
  if (localPart.length <= 2) return `${localPart[0] ?? ""}•••@${domain}`

  return `${localPart[0]}${"•".repeat(
    Math.min(6, Math.max(2, localPart.length - 2)),
  )}${localPart.at(-1)}@${domain}`
}

export default async function VerifyEmailPage() {
  const cookieStore = await cookies()
  const encodedEmail = cookieStore.get(AUTH_VERIFICATION_EMAIL_COOKIE)?.value

  if (!encodedEmail) {
    redirect("/auth")
  }

  const email = decodeURIComponent(encodedEmail)
  const emailLabel = maskEmail(email)

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col items-center gap-8">
        <header className="w-full space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to {emailLabel}.
          </p>
        </header>

        <OtpForm email={email} />
      </section>
    </main>
  )
}
