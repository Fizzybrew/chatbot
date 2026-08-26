import { AuthModal } from "@/components/auth/auth-modal"
import { EmailAuthForm } from "@/components/auth/email-auth-form"

export default function RegisterModalPage() {
  return (
    <AuthModal>
      <h1>Continue with email</h1>
      <p>Enter your email to continue.</p>
      <EmailAuthForm />
    </AuthModal>
  )
}
