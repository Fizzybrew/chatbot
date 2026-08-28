"use client"

import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { emailSchema, type EmailInput } from "@/lib/auth-schemas"

const AUTH_EMAIL_STORAGE_KEY = "auth:verification-email"

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@")
  if (!localPart || !domain) return email
  if (localPart.length <= 2) return `${localPart[0] ?? ""}•••@${domain}`
  return `${localPart[0]}${"•".repeat(Math.min(6, Math.max(2, localPart.length - 2)))}${localPart.at(-1)}@${domain}`
}

export function EmailAuthForm() {
  const router = useRouter()

  const form = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
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

    sessionStorage.setItem(AUTH_EMAIL_STORAGE_KEY, email)
    sessionStorage.setItem("auth:verification-email-label", maskEmail(email))
    router.push("/auth/verify-email")
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
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  return (
    <div className="w-full max-w-sm space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
      >
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => {
              const showError = isSubmitted && fieldState.error

              return (
                <Field data-invalid={!!showError}>
                  <FieldLabel htmlFor="auth-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    aria-invalid={!!showError}
                    aria-describedby={showError ? "auth-email-error" : undefined}
                  />
                  {showError && (
                    <FieldError id="auth-email-error">
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending code..." : "Continue with email"}
          </Button>
        </FieldGroup>
      </form>

      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={() => router.push("/auth/password")}
        disabled={isSubmitting}
      >
        Sign in with password
      </Button>
    </div>
  )
}
