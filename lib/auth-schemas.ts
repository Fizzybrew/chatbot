import { z } from "zod"

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
})

export type EmailInput = z.infer<typeof emailSchema>

export const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, "Enter a 6-digit code"),
})

export type OtpInput = z.infer<typeof otpSchema>
