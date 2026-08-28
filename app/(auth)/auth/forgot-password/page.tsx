import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col items-center gap-8">
        <header className="w-full space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a password reset link.
          </p>
        </header>

        <ForgotPasswordForm />
      </section>
    </main>
  )
}
