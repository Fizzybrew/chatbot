import { EmailAuthForm } from "@/components/auth/email-auth-form"

export default function AuthPage() {
  return (
    <main>
      <h1>Sign in or create an account</h1>
      <p>Enter your email to continue.</p>
      <EmailAuthForm />
    </main>
  )
}
