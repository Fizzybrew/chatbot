import { OtpForm } from "@/components/auth/otp-form"

export default async function VerifyAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col items-center gap-8">
        <header className="w-full space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to {email ?? "your email"}.
          </p>
        </header>

        <OtpForm email={email ?? ""} />
      </section>
    </main>
  )
}
