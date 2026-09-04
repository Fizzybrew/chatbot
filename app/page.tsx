import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="flex items-center gap-3">
        <Button asChild size="lg">
          <Link href="/auth">Sign in</Link>
        </Button>

        <ThemeToggle />
      </div>
    </main>
  )
}
