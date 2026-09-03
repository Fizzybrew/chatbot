import { EmailAuthForm } from "@/components/auth/email-auth-form"

export default function AuthPage() {
  return (
    <>
      <header className="space-y-5 text-center">
        <h1 className="text-3xl">
          Log in or sign up
        </h1>
      </header>

      <EmailAuthForm />
    </>
  )
}
