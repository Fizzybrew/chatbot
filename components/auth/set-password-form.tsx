"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { passwordSchema, type PasswordInput } from "@/lib/auth-schemas"

export function SetPasswordForm() {
  const router = useRouter()

  const form = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  })

  const onSubmit = async ({ password }: PasswordInput) => {
    form.clearErrors("root")

    const response = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        message?: string
      } | null

      form.setError("root", {
        type: "server",
        message: body?.message || "Unable to create password.",
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
        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          autoComplete="new-password"
          autoFocus
          aria-invalid={!!errors.password}
          aria-describedby={
            errors.password ? "auth-password-error" : undefined
          }
          {...register("password")}
        />
        {errors.password && (
          <p id="auth-password-error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && <p role="alert">{errors.root.message}</p>}

      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Creating password..." : "Continue"}
      </button>
    </form>
  )
}
