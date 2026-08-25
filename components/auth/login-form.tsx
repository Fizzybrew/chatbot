"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/lib/auth-client"
import { getAuthErrorMessage } from "@/lib/auth-errors"
import { loginSchema, type LoginInput } from "@/lib/auth-shemas"

export function LoginForm() {
  const router = useRouter()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginInput) => {
    form.clearErrors("root")

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: true,
    })

    if (error) {
      form.setError("root", {
        type: "server",
        message: getAuthErrorMessage(error.code),
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="login-email">Email</label>

        <input
          id="login-email"
          type="email"
          autoComplete="email"
          autoFocus
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />

        {errors.email && (
          <p id="login-email-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="login-password">Password</label>

        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={
            errors.password ? "login-password-error" : undefined
          }
          {...register("password")}
        />

        {errors.password && (
          <p id="login-password-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && <p role="alert">{errors.root.message}</p>}

      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <p>
        Don{"'"}t have an account? <Link href="/register"> Sign up </Link>
      </p>
    </form>
  )
}
