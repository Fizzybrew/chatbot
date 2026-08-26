import { AuthModal } from "@/components/auth/auth-modal"
import { EmailAuthForm } from "@/components/auth/email-auth-form"

export default function LoginModalPage() {
  return (
    <AuthModal>
      <h1>Sign in</h1>
      <p>Enter your email to continue.</p>
      <EmailAuthForm />
    </AuthModal>
  )
}
