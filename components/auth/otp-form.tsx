"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { otpSchema, type OtpInput } from "@/lib/auth-schemas"

interface OtpFormProps {
  email: string
}

const RESEND_COOLDOWN_SECONDS = 30
const AUTH_EMAIL_STORAGE_KEY = "auth:verification-email"

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

    if (!email) {
      router.replace("/auth")
      return
    }

    const { error } = await authClient.signIn.emailOtp({ email, otp })

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message || "Invalid verification code.",
      })
      return
    }

    sessionStorage.removeItem(AUTH_EMAIL_STORAGE_KEY)
    sessionStorage.removeItem("auth:verification-email-label")
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
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  const isLoading = isSubmitting || isResending

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[340px]">
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
                <InputOTP
                  id="auth-otp"
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={isLoading}
                  autoFocus
                  aria-invalid={!!showError}
                  aria-describedby={showError ? "auth-otp-error" : undefined}
                  className="h-13 w-full rounded-full text-base"
                >
                  <InputOTPGroup className="w-full justify-between">
                    <InputOTPSlot index={0} className="h-13 w-[calc((100%-2.5rem)/6)] rounded-full text-base" />
                    <InputOTPSlot index={1} className="h-13 w-[calc((100%-2.5rem)/6)] rounded-full text-base" />
                    <InputOTPSlot index={2} className="h-13 w-[calc((100%-2.5rem)/6)] rounded-full text-base" />
                    <InputOTPSlot index={3} className="h-13 w-[calc((100%-2.5rem)/6)] rounded-full text-base" />
                    <InputOTPSlot index={4} className="h-13 w-[calc((100%-2.5rem)/6)] rounded-full text-base" />
                    <InputOTPSlot index={5} className="h-13 w-[calc((100%-2.5rem)/6)] rounded-full text-base" />
                  </InputOTPGroup>
                </InputOTP>
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
            {isResending
              ? <Spinner />
              : resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Resend code"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-13 w-full rounded-full text-base"
            disabled={isLoading}
            onClick={() => router.replace("/auth")}
          >
            Change email
          </Button>
        </FieldGroup>
      </FieldGroup>
    </form>
  )
}
