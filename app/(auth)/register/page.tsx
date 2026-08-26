import { EmailAuthForm } from "@/components/auth/email-auth-form"

export default function RegisterPage() {
  return (
    <main>
      <h1>Continue with email</h1>
      <p>Enter your email to continue.</p>
      <EmailAuthForm />
    </main>
  )
}
