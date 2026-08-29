"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

export function AddPasskeyButton() {
  const { data: session, isPending } = authClient.useSession()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isPending || !session) {
    return null
  }

  const handleAddPasskey = async () => {
    setError(null)
    setIsCreating(true)

    const { error } = await authClient.passkey.addPasskey({
      name: "This device",
      authenticatorAttachment: "platform",
      createSession: false,
    })

    setIsCreating(false)

    if (error) {
      setError(error.message || "Unable to create your passkey.")
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleAddPasskey}
        disabled={isCreating}
      >
        {isCreating ? <Spinner /> : "Добавить Passkey"}
      </Button>
      {error && <FieldError>{error}</FieldError>}
    </div>
  )
}
