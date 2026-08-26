import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type EmailInput = z.infer<typeof emailSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, "Enter a 6-digit code"),
});

export type OtpInput = z.infer<typeof otpSchema>;

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export type PasswordInput = z.infer<typeof passwordSchema>;