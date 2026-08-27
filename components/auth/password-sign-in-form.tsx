"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/lib/auth-client"
import { emailSchema, passwordSchema } from "@/lib/auth-schemas"
import { z } from "zod"

const passwordSignInSchema = emailSchema.extend({
  password: passwordSchema.shape.password,
})

type PasswordSignInInput = z.infer<typeof passwordSignInSchema>

export function PasswordSignInForm() {
  const router = useRouter()

  const form = useForm<PasswordSignInInput>({
    resolver: zodResolver(passwordSignInSchema),
    mode: "onChange",
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
    formState: { errors, isValid, isSubmitting },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="password-email">Email</label>
        <input
          id="password-email"
          type="email"
          autoComplete="email"
          autoFocus
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "password-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="password-email-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && <p role="alert">{errors.root.message}</p>}

      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <button type="button" onClick={() => router.push("/auth")}>
        Back to authentication
      </button>
    </form>
  )
}
