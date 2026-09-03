"use client"

import { useState } from "react"

import { EmailAuthForm } from "@/components/auth/email-auth-form"
import { OtpForm } from "@/components/auth/otp-form"

interface AuthFlowProps {
  onAuthenticated?: () => void
}

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@")

  if (!localPart || !domain) return email
  if (localPart.length <= 2) return `${localPart[0] ?? ""}•••@${domain}`

  return `${localPart[0]}${"•".repeat(
    Math.min(6, Math.max(2, localPart.length - 2)),
  )}${localPart.at(-1)}@${domain}`
}

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")

  if (step === "otp") {
    return (
      <div className="space-y-6">
        <header className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Check your inbox</h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code we sent to {maskEmail(email)}.
          </p>
        </header>

        <OtpForm
          email={email}
          onAuthenticated={onAuthenticated}
          onChangeEmail={() => setStep("email")}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Log in or sign up</h2>
        <p className="text-sm text-muted-foreground">
          Continue with a social account or your email address.
        </p>
      </header>

      <EmailAuthForm
        onOtpSent={(nextEmail) => {
          setEmail(nextEmail)
          setStep("otp")
        }}
        onAuthenticated={onAuthenticated}
      />

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        By continuing, you agree to our Terms of Service and acknowledge our
        Privacy Policy.
      </p>
    </div>
  )
}
