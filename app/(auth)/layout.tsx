import type { ReactNode } from "react"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <section className="max-w-85 space-y-5">
        {children}
      </section>
    </main>
  )
}
