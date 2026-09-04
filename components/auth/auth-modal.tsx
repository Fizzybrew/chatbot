"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { XIcon } from "lucide-react"

import { AuthFlow } from "@/components/auth/auth-flow"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

export function AuthModal() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setOpen(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const requestClose = () => {
    setOpen(false)
  }

  const handleOpenChangeComplete = (nextOpen: boolean) => {
    if (!nextOpen) {
      router.back()
    }
  }

  if (isMobile === null) {
    return null
  }

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={setOpen}
        onOpenChangeComplete={handleOpenChangeComplete}
      >
        <DrawerContent className="max-h-[92dvh] px-0">
          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3 z-10 rounded-full"
                aria-label="Close authentication"
              />
            }
          >
            <XIcon />
          </DrawerClose>

          <DrawerHeader className="sr-only">
            <DrawerTitle>Authentication</DrawerTitle>
            <DrawerDescription>
              Sign in or create an account to continue.
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto px-6 pb-6">
            <AuthFlow onAuthenticated={requestClose} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent className="max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <AuthFlow onAuthenticated={requestClose} />
      </DialogContent>
    </Dialog>
  )
}
