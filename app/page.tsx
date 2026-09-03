import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Button asChild size="lg">
        <Link href="/auth">Sign in</Link>
      </Button>
    </main>
  )
}
