"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

export function PasskeySetupForm() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreatePasskey = async () => {
    setError(null)
    setIsCreating(true)

    const { error } = await authClient.passkey.addPasskey({
      createSession: false,
    })

    if (error) {
      setIsCreating(false)
      setError(error.message || "Unable to create your passkey.")
      return
    }

    router.replace("/")
    router.refresh()
  }

  const handleSkip = () => {
    router.replace("/")
    router.refresh()
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {error && <FieldError>{error}</FieldError>}

      <Button
        type="button"
        className="h-13 w-full rounded-full text-base"
        onClick={handleCreatePasskey}
        disabled={isCreating}
      >
        {isCreating ? <Spinner /> : "Create a passkey"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="h-13 w-full rounded-full text-base"
        onClick={handleSkip}
        disabled={isCreating}
      >
        Not now
      </Button>
    </div>
  )
}
