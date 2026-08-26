"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/lib/auth-client"
import { otpSchema, type OtpInput } from "@/lib/auth-schemas"

interface OtpFormProps {
  email: string
}

export function OtpForm({ email }: OtpFormProps) {
  const router = useRouter()

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
      router.replace("/login")
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

    const { data: accounts, error: accountsError } =
      await authClient.listAccounts()

    if (accountsError) {
      form.setError("root", {
        type: "server",
        message: accountsError.message || "Unable to load your account.",
      })
      return
    }

    const hasPassword = accounts?.some(
      (account) => account.providerId === "credential",
    )

    if (hasPassword) {
      router.replace("/")
      router.refresh()
      return
    }

    router.replace(`/login/password?email=${encodeURIComponent(email)}`)
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
    </form>
  )
}
