import { EmailAuthForm } from "@/components/auth/email-auth-form"

export default function LoginPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <p>Enter your email to continue.</p>
      <EmailAuthForm />
    </main>
  )
}
