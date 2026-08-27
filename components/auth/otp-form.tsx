"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
    mode: "onChange",
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
    formState: { errors, isValid, isSubmitting },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="auth-otp">Verification code</label>
        <input
          id="auth-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          aria-invalid={!!errors.otp}
          aria-describedby={errors.otp ? "auth-otp-error" : undefined}
          {...register("otp")}
        />
        {errors.otp && (
          <p id="auth-otp-error" role="alert">
            {errors.otp.message}
          </p>
        )}
      </div>

      {errors.root && <p role="alert">{errors.root.message}</p>}

      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        disabled={resendCooldown > 0 || isResending}
        onClick={onResend}
      >
        {isResending
          ? "Sending..."
          : resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Resend code"}
      </button>
    </form>
  )
}
