"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { otpSchema, type OtpInput } from "@/lib/auth-schemas"

interface OtpFormProps {
  email: string
  onAuthenticated?: () => void
  onChangeEmail: () => void
  onOtpResent?: () => void
}

const RESEND_COOLDOWN_SECONDS = 30

export function OtpForm({
  email,
  onAuthenticated,
  onChangeEmail,
  onOtpResent,
}: OtpFormProps) {
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

    onAuthenticated?.()
  }

  const onResend = async () => {
    if (resendCooldown > 0 || isResending) return

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
        message:
          error.message ||
          "Unable to resend the verification code. Please try again.",
      })
      return
    }

    setResendCooldown(RESEND_COOLDOWN_SECONDS)
    form.reset({ otp: "" })
    onOtpResent?.()
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  const isLoading = isSubmitting || isResending
  const showRootError = isSubmitted && errors.root

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FieldGroup>
        <Field data-invalid={!!(isSubmitted && errors.otp)}>
          <FieldLabel htmlFor="auth-otp" className="sr-only">
            Verification code
          </FieldLabel>
          <Input
            {...register("otp")}
            id="auth-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            pattern="[0-9]*"
            placeholder="6-digit code"
            autoFocus
            aria-invalid={!!(isSubmitted && errors.otp)}
            aria-describedby={
              isSubmitted && errors.otp ? "auth-otp-error" : undefined
            }
            onInput={(event) => {
              event.currentTarget.value = event.currentTarget.value
                .replace(/\D/g, "")
                .slice(0, 6)
            }}
            disabled={isLoading}
            className="h-13 w-full rounded-full px-5 py-3 text-center text-base tracking-[0.35em]"
          />
          {isSubmitted && errors.otp && (
            <FieldError id="auth-otp-error">
              {errors.otp.message}
            </FieldError>
          )}
        </Field>

        {showRootError && <FieldError>{errors.root?.message}</FieldError>}

        <FieldGroup className="gap-2">
          <Button
            type="submit"
            className="h-13 w-full rounded-full text-base font-normal"
            disabled={isLoading}
          >
            {isSubmitting && <Spinner />}
            Continue
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-12 w-full rounded-full text-base font-normal"
            disabled={resendCooldown > 0 || isLoading}
            onClick={onResend}
          >
            {isResending && <Spinner />}
            {resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Resend code"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-12 w-full rounded-full text-base font-normal text-muted-foreground"
            disabled={isLoading}
            onClick={onChangeEmail}
          >
            Use a different email
          </Button>
        </FieldGroup>
      </FieldGroup>
    </form>
  )
}
