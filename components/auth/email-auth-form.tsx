"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/lib/auth-client"
import { emailSchema, type EmailInput } from "@/lib/auth-schemas"

export function EmailAuthForm() {
  const router = useRouter()

  const form = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async ({ email }: EmailInput) => {
    form.clearErrors("root")

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    })

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message || "Unable to send verification code.",
      })
      return
    }

    router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
  }

  const handleGoogleSignIn = async () => {
    form.clearErrors("root")

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message || "Unable to continue with Google.",
      })
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = form

  return (
    <div>
      <button type="button" onClick={handleGoogleSignIn}>
        Continue with Google
      </button>

      <div>or</div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            autoFocus
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "auth-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="auth-email-error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {errors.root && <p role="alert">{errors.root.message}</p>}

        <button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Sending code..." : "Continue with email"}
        </button>
      </form>

      <button type="button" onClick={() => router.push("/auth/password")}>
        Sign in with password
      </button>
    </div>
  )
}
