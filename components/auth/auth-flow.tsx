"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { EmailAuthForm } from "@/components/auth/email-auth-form"
import { OtpForm } from "@/components/auth/otp-form"
import { Button } from "@/components/ui/button"

interface AuthFlowProps {
  onAuthenticated?: () => void
}

const OTP_EXPIRATION_MS = 5 * 60 * 1000

type AuthStep = "email" | "otp"

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@")

  if (!localPart || !domain) return email
  if (localPart.length <= 2) return `${localPart[0] ?? ""}•••@${domain}`

  return `${localPart[0]}${"•".repeat(
    Math.min(6, Math.max(2, localPart.length - 2)),
  )}${localPart.at(-1)}@${domain}`
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [step, setStep] = useState<AuthStep>("email")
  const [email, setEmail] = useState("")
  const [otpEmail, setOtpEmail] = useState("")
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!otpExpiresAt) return

    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [otpExpiresAt])

  const otpIsActive =
    otpExpiresAt !== null &&
    otpExpiresAt > now &&
    normalizeEmail(email) === normalizeEmail(otpEmail)

  const handleOtpSent = (nextEmail: string) => {
    const normalizedEmail = normalizeEmail(nextEmail)

    setEmail(nextEmail)
    setOtpEmail(normalizedEmail)
    setOtpExpiresAt(Date.now() + OTP_EXPIRATION_MS)
    setNow(Date.now())
    setStep("otp")
  }

  const handleOtpResent = () => {
    setOtpExpiresAt(Date.now() + OTP_EXPIRATION_MS)
    setNow(Date.now())
  }

  const handleEmailChange = (nextEmail: string) => {
    setEmail(nextEmail)
  }

  const handleEnterExistingCode = () => {
    if (!otpIsActive) return

    setEmail(otpEmail)
    setStep("otp")
  }

  if (step === "otp") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 rounded-full"
            onClick={() => setStep("email")}
            aria-label="Back to email"
          >
            <ArrowLeft />
            Back
          </Button>
          <div aria-hidden="true" className="w-16" />
        </div>

        <header className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Check your inbox</h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code we sent to {maskEmail(otpEmail)}.
          </p>
        </header>

        <OtpForm
          email={otpEmail}
          onAuthenticated={onAuthenticated}
          onChangeEmail={() => setStep("email")}
          onOtpResent={handleOtpResent}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-24" />
        {otpIsActive ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-mr-2 gap-2 rounded-full"
            onClick={handleEnterExistingCode}
          >
            Enter code
            <ArrowRight />
          </Button>
        ) : (
          <div className="w-24" aria-hidden="true" />
        )}
      </div>

      <header className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Log in or sign up</h2>
        <p className="text-sm text-muted-foreground">
          Continue with a social account or your email address.
        </p>
      </header>

      <EmailAuthForm
        onEmailChange={handleEmailChange}
        onOtpSent={handleOtpSent}
        onAuthenticated={onAuthenticated}
      />

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        By continuing, you agree to our Terms of Service and acknowledge our Privacy
        Policy.
      </p>
    </div>
  )
}
