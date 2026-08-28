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
import { passwordSchema, type PasswordInput } from "@/lib/auth-schemas"

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [success, setSuccess] = useState(false)

  const form = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { password: "" },
  })

  const onSubmit = async ({ password }: PasswordInput) => {
    form.clearErrors("root")

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message || "This reset link is invalid or expired.",
      })
      return
    }

    setSuccess(true)
    form.reset()
  }

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  if (success) {
    return (
      <div className="w-full max-w-[340px] space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Your password has been reset. You can now sign in with your new password.
        </p>
        <Button
          className="h-13 rounded-full text-base w-full"
          onClick={() => router.replace("/auth/password")}
        >
          Sign in
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[340px]">
      <FieldGroup>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => {
            const showError = isSubmitted && fieldState.error

            return (
              <Field data-invalid={!!showError}>
                <FieldLabel htmlFor="reset-password" className="sr-only">
                  New password
                </FieldLabel>
                <Input
                  {...field}
                  id="reset-password"
                  type="password"
                  placeholder="New password"
                  className="h-13 rounded-full text-base w-full"
                  autoComplete="new-password"
                  autoFocus
                  aria-invalid={!!showError}
                  aria-describedby={showError ? "reset-password-error" : undefined}
                  disabled={isSubmitting}
                />
                {showError && (
                  <FieldError id="reset-password-error">
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
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Reset password"}
        </Button>
      </FieldGroup>
    </form>
  )
}
