"use client"

import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { emailSchema, type EmailInput } from "@/lib/auth-schemas"

interface EmailAuthFormProps {
  onOtpSent: (email: string) => void
  onAuthenticated?: () => void
}

export function EmailAuthForm({
  onOtpSent,
  onAuthenticated,
}: EmailAuthFormProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false)

  const form = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { email: "" },
  })

  useEffect(() => {
    if (
      typeof PublicKeyCredential === "undefined" ||
      !PublicKeyCredential.isConditionalMediationAvailable
    ) {
      return
    }

    void (async () => {
      if (!(await PublicKeyCredential.isConditionalMediationAvailable())) {
        return
      }

      const { error } = await authClient.signIn.passkey({
        autoFill: true,
      })

      if (!error) {
        onAuthenticated?.()
      }
    })()
  }, [onAuthenticated])

  const onSubmit = async ({ email }: EmailInput) => {
    form.clearErrors("root")

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    })

    if (error) {
      form.setError("root", {
        type: "server",
        message:
          error.message ||
          "Unable to send the verification code. Please try again.",
      })
      return
    }

    onOtpSent(email)
  }

  const handleGoogleSignIn = async () => {
    form.clearErrors("root")
    setIsGoogleLoading(true)

    const { error } = await authClient.signIn.social({
      provider: "google",
    })

    if (error) {
      setIsGoogleLoading(false)
      form.setError("root", {
        type: "server",
        message:
          error.message || "Unable to continue with Google. Please try again.",
      })
    }
  }

  const handleGithubSignIn = async () => {
    form.clearErrors("root")
    setIsGithubLoading(true)

    const { error } = await authClient.signIn.social({
      provider: "github",
    })

    if (error) {
      setIsGithubLoading(false)
      form.setError("root", {
        type: "server",
        message:
          error.message || "Unable to continue with GitHub. Please try again.",
      })
    }
  }

  const handlePasskeySignIn = async () => {
    form.clearErrors("root")
    setIsPasskeyLoading(true)

    const { error } = await authClient.signIn.passkey({
      autoFill: false,
    })

    if (!error) {
      onAuthenticated?.()
      return
    }

    setIsPasskeyLoading(false)
    form.setError("root", {
      type: "server",
      message:
        error.message || "Unable to continue with passkey. Please try again.",
    })
  }

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = form

  const isLoading =
    isSubmitting || isGoogleLoading || isGithubLoading || isPasskeyLoading

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="h-13 w-full rounded-full text-base font-normal"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isGoogleLoading && <Spinner />}
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-13 w-full rounded-full text-base font-normal"
          onClick={handleGithubSignIn}
          disabled={isLoading}
        >
          {isGithubLoading && <Spinner />}
          Continue with GitHub
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-13 w-full rounded-full text-base font-normal"
          onClick={handlePasskeySignIn}
          disabled={isLoading}
        >
          {isPasskeyLoading && <Spinner />}
          Continue with passkey
        </Button>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <Separator className="flex-1" />
        <span>OR</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => {
              const showError = isSubmitted && fieldState.error

              return (
                <Field data-invalid={!!showError}>
                  <FieldLabel htmlFor="auth-email" className="sr-only">
                    Email address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="auth-email"
                    type="email"
                    placeholder="Email address"
                    className="h-13 w-full rounded-full px-5 py-3 text-base"
                    autoComplete="email"
                    autoFocus
                    aria-invalid={!!showError}
                    aria-describedby={
                      showError ? "auth-email-error" : undefined
                    }
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
            className="h-13 w-full rounded-full text-base font-normal"
            disabled={isLoading}
          >
            {isSubmitting && <Spinner />}
            Continue
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
