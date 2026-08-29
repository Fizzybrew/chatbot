import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { PasskeySetupForm } from "@/components/auth/passkey-setup-form"
import { auth } from "@/lib/auth"

export default async function SetupPasskeyPage() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session?.user) {
    redirect("/auth")
  }

  const passkeys = await auth.api.listPasskeys({ headers: requestHeaders })

  if (passkeys.length > 0) {
    redirect("/")
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col items-center gap-8">
        <header className="w-full space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create a passkey
          </h1>
          <p className="text-sm text-muted-foreground">
            Use your device unlock method for faster, passwordless sign-in.
          </p>
        </header>

        <PasskeySetupForm />
      </section>
    </main>
  )
}
