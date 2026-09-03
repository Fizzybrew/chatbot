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
    <>
      <header className="space-y-5 text-center">
        <h1 className="text-3xl">
          Check your inbox
        </h1>
        <p>
          Enter the verification code we just sent to {emailLabel} to continue
        </p>
      </header>

      <OtpForm email={email} />
    </>
  )
}
