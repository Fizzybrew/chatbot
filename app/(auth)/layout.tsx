import type { ReactNode } from "react"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col items-center gap-8">
        {children}
      </section>
    </main>
  )
}
