import { PasswordSignInForm } from "@/components/auth/password-sign-in-form"

export default function PasswordSignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col items-center gap-8">
        <header className="w-full space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in with password</h1>
          <p className="text-sm text-muted-foreground">
            Use your email and password to sign in.
          </p>
        </header>

        <PasswordSignInForm />
      </section>
    </main>
  )
}
