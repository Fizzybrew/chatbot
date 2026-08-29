import { EmailAuthForm } from "@/components/auth/email-auth-form"
import { LogoutButton } from "@/components/auth/logout-button"

export default function AuthPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col items-center gap-8">
        <header className="w-full space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in or sign up
          </h1>
          <p className="text-sm text-muted-foreground">
            Continue with Google, GitHub, passkey, or email.
          </p>
        </header>

        <EmailAuthForm />
        <LogoutButton />
      </section>
    </main>
  )
}
