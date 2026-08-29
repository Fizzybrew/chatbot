"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { sendEmailVerificationOtp } from "@/lib/auth-verification-actions"
import { emailSchema, type EmailInput } from "@/lib/auth-schemas"

export function EmailAuthForm() {
  const router = useRouter()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isYandexLoading, setIsYandexLoading] = useState(false)

  const form = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  })

  const onSubmit = async ({ email }: EmailInput) => {
    form.clearErrors("root")

    const result = await sendEmailVerificationOtp(email)

    if (!result.success) {
      form.setError("root", {
        type: "server",
        message: result.message,
      })
      return
    }

    router.push("/auth/verify-email")
  }

  const handleGoogleSignIn = async () => {
    form.clearErrors("root")
    setIsGoogleLoading(true)

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })

    if (error) {
      setIsGoogleLoading(false)
      form.setError("root", {
        type: "server",
        message: error.message || "Unable to continue with Google.",
      })
    }
  }

  const handleYandexSignIn = async () => {
    form.clearErrors("root")
    setIsYandexLoading(true)

    const { error } = await authClient.signIn.social({
      provider: "yandex",
      callbackURL: "/",
    })

    if (error) {
      setIsYandexLoading(false)
      form.setError("root", {
        type: "server",
        message: error.message || "Unable to continue with Yandex.",
      })
    }
  }

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  const isLoading = isSubmitting || isGoogleLoading || isYandexLoading

  return (
    <div className="w-full max-w-85 space-y-4">
      <Button
        type="button"
        variant="outline"
        className="h-13 rounded-full text-base w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isGoogleLoading ? <Spinner /> : "Continue with Google"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-13 rounded-full text-base w-full"
        onClick={handleYandexSignIn}
        disabled={isLoading}
      >
        {isYandexLoading ? <Spinner /> : "Continue with Yandex"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-13 rounded-full text-base w-full"
        onClick={() => router.push("/auth/password")}
        disabled={isLoading}
      >
        Continue with password
      </Button>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>OR</span>
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
                  <FieldLabel htmlFor="auth-email" className="sr-only">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="auth-email"
                    type="email"
                    placeholder="Email"
                    className="h-13 rounded-full text-base w-full"
                    autoComplete="email"
                    autoFocus
                    aria-invalid={!!showError}
                    aria-describedby={showError ? "auth-email-error" : undefined}
                    disabled={isLoading}
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

          <Button
            type="submit"
            className="h-13 rounded-full text-base w-full"
            disabled={isLoading}
          >
            {isSubmitting ? <Spinner /> : "Continue with email"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
