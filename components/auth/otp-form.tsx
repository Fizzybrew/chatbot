"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import {
  clearEmailVerificationCookie,
  sendEmailVerificationOtp,
} from "@/lib/auth-verification-actions"
import { otpSchema, type OtpInput } from "@/lib/auth-schemas"

interface OtpFormProps {
  email: string
}

const RESEND_COOLDOWN_SECONDS = 30

export function OtpForm({ email }: OtpFormProps) {
  const router = useRouter()
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS)
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
    defaultValues: { otp: "" },
  })

  const onSubmit = async ({ otp }: OtpInput) => {
    form.clearErrors("root")

    const { error } = await authClient.signIn.emailOtp({ email, otp })

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message || "Invalid verification code.",
      })
      return
    }

    await clearEmailVerificationCookie()
    router.replace("/auth/setup-passkey")
    router.refresh()
  }

  const onResend = async () => {
    if (resendCooldown > 0 || isResending) return

    form.clearErrors("root")
    setIsResending(true)

    const result = await sendEmailVerificationOtp(email)

    setIsResending(false)

    if (!result.success) {
      form.setError("root", {
        type: "server",
        message: result.message,
      })
      return
    }

    setResendCooldown(RESEND_COOLDOWN_SECONDS)
    form.reset({ otp: "" })
  }

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  const isLoading = isSubmitting || isResending

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-85"
    >
      <FieldGroup>
        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => {
            const showError = isSubmitted && fieldState.error

            return (
              <Field data-invalid={!!showError}>
                <FieldLabel htmlFor="auth-otp" className="sr-only">
                  Verification code
                </FieldLabel>
                <Input
                  id="auth-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  pattern="[0-9]*"
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.value.replace(/\D/g, ""))
                  }}
                  onBlur={field.onBlur}
                  disabled={isLoading}
                  autoFocus
                  aria-invalid={!!showError}
                  aria-describedby={showError ? "auth-otp-error" : undefined}
                  className="h-13 w-full rounded-full text-base"
                />
                {showError && (
                  <FieldError id="auth-otp-error">
                    {fieldState.error?.message}
                  </FieldError>
                )}
              </Field>
            )
          }}
        />

        {isSubmitted && errors.root && (
          <FieldError>{errors.root.message}</FieldError>
        )}

        <FieldGroup className="gap-2">
          <Button
            type="submit"
            className="h-13 w-full rounded-full text-base"
            disabled={isLoading}
          >
            {isSubmitting ? <Spinner /> : "Verify"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-13 w-full rounded-full text-base"
            disabled={resendCooldown > 0 || isLoading}
            onClick={onResend}
          >
            {isResending ? (
              <Spinner />
            ) : resendCooldown > 0 ? (
              `Resend code in ${resendCooldown}s`
            ) : (
              "Resend code"
            )}
          </Button>
        </FieldGroup>
      </FieldGroup>
    </form>
  )
}
