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
        <DrawerContent className="h-[100dvh] max-h-[100dvh] rounded-none px-0">
          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3 z-20 rounded-full"
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

          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-[calc(6rem+env(safe-area-inset-bottom))]">
            <AuthFlow onAuthenticated={requestClose} />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-6 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Button
              type="button"
              variant="secondary"
              className="pointer-events-auto h-11 rounded-full px-6 shadow-lg backdrop-blur"
              onClick={requestClose}
            >
              Skip
            </Button>
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
