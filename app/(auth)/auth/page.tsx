import { EmailAuthForm } from "@/components/auth/email-auth-form"

export default function AuthPage() {
  return (
    <>
      <header className="w-full space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in or sign up
        </h1>
        <p className="text-sm text-muted-foreground">
          Continue with Google, GitHub, passkey, or email.
        </p>
      </header>

      <EmailAuthForm />
    </>
  )
}
