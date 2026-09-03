"use client"

import { useRouter } from "next/navigation"

import { AuthFlow } from "@/components/auth/auth-flow"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

export function AuthModal() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const handleClose = () => {
    router.back()
  }

  if (isMobile === null) {
    return null
  }

  if (isMobile) {
    return (
      <Drawer open onOpenChange={(open) => !open && handleClose()}>
        <DrawerContent className="max-h-[92dvh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Authentication</DrawerTitle>
            <DrawerDescription>
              Sign in or create an account to continue.
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-6 pb-6">
            <AuthFlow onAuthenticated={handleClose} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <AuthFlow onAuthenticated={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
