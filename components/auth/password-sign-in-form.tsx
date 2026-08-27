"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  const showEmailError = isSubmitted && errors.email
  const showPasswordError = isSubmitted && errors.password

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password-email">Email</FieldLabel>
          <Input
            id="password-email"
            type="email"
            autoComplete="email"
            autoFocus
            aria-invalid={!!showEmailError}
            aria-describedby={showEmailError ? "password-email-error" : undefined}
            {...register("email")}
          />
          {showEmailError && (
            <FieldError id="password-email-error">
              {errors.email?.message}
            </FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!showPasswordError}
            aria-describedby={showPasswordError ? "password-error" : undefined}
            {...register("password")}
          />
          {showPasswordError && (
            <FieldError id="password-error">
              {errors.password?.message}
            </FieldError>
          )}
        </Field>

        {isSubmitted && errors.root && (
          <FieldError>{errors.root.message}</FieldError>
        )}

        <FieldGroup className="gap-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/auth")}
            disabled={isSubmitting}
          >
            Back to authentication
          </Button>
        </FieldGroup>
      </FieldGroup>
    </form>
  )
}
