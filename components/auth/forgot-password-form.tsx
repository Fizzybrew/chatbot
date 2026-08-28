"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { emailSchema, type EmailInput } from "@/lib/auth-schemas"

export function ForgotPasswordForm() {
  const form = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  })

  const onSubmit = async ({ email }: EmailInput) => {
    form.clearErrors("root")

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      form.setError("root", {
        type: "server",
        message: "Unable to send password reset email. Please try again.",
      })
      return
    }

    form.setError("root", {
      type: "success",
      message: "If an account exists for this email, a reset link has been sent.",
    })
  }

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-85">
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => {
            const showError = isSubmitted && fieldState.error

            return (
              <Field data-invalid={!!showError}>
                <FieldLabel htmlFor="forgot-password-email" className="sr-only">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="forgot-password-email"
                  type="email"
                  placeholder="Email"
                  className="h-13 rounded-full text-base w-full"
                  autoComplete="email"
                  autoFocus
                  aria-invalid={!!showError}
                  aria-describedby={showError ? "forgot-password-email-error" : undefined}
                  disabled={isSubmitting}
                />
                {showError && (
                  <FieldError id="forgot-password-email-error">
                    {fieldState.error?.message}
                  </FieldError>
                )}
              </Field>
            )
          }}
        />

        {isSubmitted && errors.root && (
          errors.root.type === "success" ? (
            <p className="text-sm text-muted-foreground">{errors.root.message}</p>
          ) : (
            <FieldError>{errors.root.message}</FieldError>
          )
        )}

        <Button
          type="submit"
          className="h-13 rounded-full text-base w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Send reset link"}
        </Button>
      </FieldGroup>
    </form>
  )
}
