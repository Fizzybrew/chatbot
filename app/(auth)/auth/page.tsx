import type { Metadata } from "next"

import { AuthPage } from "@/components/auth/auth-page"

export const metadata: Metadata = {
  title: "Log in or sign up",
  robots: {
    index: false,
    follow: false,
  },
}

export default function Page() {
  return <AuthPage />
}
