"use client"

import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { emailSchema, passwordSchema } from "@/lib/auth-schemas"

const passwordSignInSchema = emailSchema.extend({
  password: passwordSchema.shape.password,
})

type PasswordSignInInput = z.infer<typeof passwordSignInSchema>

export function PasswordSignInForm() {
  const router = useRouter()

  const form = useForm<PasswordSignInInput>({
    resolver: zodResolver(passwordSignInSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async ({ email, password }: PasswordSignInInput) => {
    form.clearErrors("root")

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    })

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message || "Unable to sign in with password.",
      })
      return
    }

    router.replace("/")
    router.refresh()
  }

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[340px]">
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => {
            const showError = isSubmitted && fieldState.error

            return (
              <Field data-invalid={!!showError}>
                <FieldLabel htmlFor="password-email" className="sr-only">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="password-email"
                  type="email"
                  placeholder="Email"
                  className="h-13 rounded-full text-base w-full"
                  autoComplete="email"
                  autoFocus
                  aria-invalid={!!showError}
                  aria-describedby={showError ? "password-email-error" : undefined}
                  disabled={isSubmitting}
                />
                {showError && (
                  <FieldError id="password-email-error">
                    {fieldState.error?.message}
                  </FieldError>
                )}
              </Field>
            )
          }}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => {
            const showError = isSubmitted && fieldState.error

            return (
              <Field data-invalid={!!showError}>
                <FieldLabel htmlFor="password" className="sr-only">
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="h-13 rounded-full text-base w-full"
                  autoComplete="current-password"
                  aria-invalid={!!showError}
                  aria-describedby={showError ? "password-error" : undefined}
                  disabled={isSubmitting}
                />
                {showError && (
                  <FieldError id="password-error">{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )
          }}
        />

        <Button
          type="button"
          variant="link"
          className="h-13 rounded-full text-base w-full"
          onClick={() => router.push("/auth/forgot-password")}
          disabled={isSubmitting}
        >
          Forgot password?
        </Button>

        {isSubmitted && errors.root && (
          <FieldError>{errors.root.message}</FieldError>
        )}

        <Button
          type="submit"
          className="h-13 rounded-full text-base w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  )
}
