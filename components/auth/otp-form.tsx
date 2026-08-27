"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { otpSchema, type OtpInput } from "@/lib/auth-schemas"

interface OtpFormProps {
  email: string
}

const RESEND_COOLDOWN_SECONDS = 30

export function OtpForm({ email }: OtpFormProps) {
  const router = useRouter()
  const [resendCooldown, setResendCooldown] = useState(
    RESEND_COOLDOWN_SECONDS,
  )
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (resendCooldown === 0) return

    const timer = window.setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [resendCooldown])

  const form = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit = async ({ otp }: OtpInput) => {
    form.clearErrors("root")

    if (!email) {
      router.replace("/auth")
      return
    }

    const { error } = await authClient.signIn.emailOtp({
      email,
      otp,
    })

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message || "Invalid verification code.",
      })
      return
    }

    router.replace("/")
    router.refresh()
  }

  const onResend = async () => {
    if (!email || resendCooldown > 0 || isResending) return

    form.clearErrors("root")
    setIsResending(true)

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    })

    setIsResending(false)

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message || "Unable to resend verification code.",
      })
      return
    }

    setResendCooldown(RESEND_COOLDOWN_SECONDS)
    form.reset({ otp: "" })
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  const showOtpError = isSubmitted && errors.otp

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="auth-otp">Verification code</FieldLabel>
          <Input
            id="auth-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            placeholder="000000"
            aria-invalid={!!showOtpError}
            aria-describedby={showOtpError ? "auth-otp-error" : undefined}
            {...register("otp")}
          />
          {showOtpError && (
            <FieldError id="auth-otp-error">{errors.otp?.message}</FieldError>
          )}
        </Field>

        {isSubmitted && errors.root && (
          <FieldError>{errors.root.message}</FieldError>
        )}

        <FieldGroup className="gap-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={resendCooldown > 0 || isResending || isSubmitting}
            onClick={onResend}
          >
            {isResending
              ? "Sending..."
              : resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Resend code"}
          </Button>
        </FieldGroup>
      </FieldGroup>
    </form>
  )
}
