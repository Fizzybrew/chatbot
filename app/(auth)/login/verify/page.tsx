import { OtpForm } from "@/components/auth/otp-form"

export default async function VerifyLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <main>
      <h1>Check your email</h1>
      <p>Enter the verification code sent to {email ?? "your email"}.</p>
      <OtpForm email={email ?? ""} />
    </main>
  )
}
