"use server"

import { cookies } from "next/headers"
import { auth } from "@/lib/auth"

const AUTH_VERIFICATION_EMAIL_COOKIE = "auth_verification_email"
const AUTH_VERIFICATION_EMAIL_MAX_AGE = 300

export async function sendEmailVerificationOtp(email: string) {
  try {
    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "sign-in",
      },
    })

    const cookieStore = await cookies()

    cookieStore.set(AUTH_VERIFICATION_EMAIL_COOKIE, encodeURIComponent(email), {
      httpOnly: true,
      maxAge: AUTH_VERIFICATION_EMAIL_MAX_AGE,
      path: "/auth",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return { success: true as const }
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "Unable to send the verification code. Please try again.",
    }
  }
}

export async function clearEmailVerificationCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_VERIFICATION_EMAIL_COOKIE)
}
