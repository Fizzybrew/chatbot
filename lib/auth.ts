import { betterAuth } from "better-auth"
import { emailOTP } from "better-auth/plugins"
import { Pool } from "pg"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)
const resendFrom =
  process.env.RESEND_FROM_EMAIL ?? "Chatbot <onboarding@resend.dev>"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        void resend.emails.send({
          from: resendFrom,
          to: email,
          subject:
            type === "sign-in" ? "Your sign-in code" : "Your verification code",
          text: `Your verification code is ${otp}.`,
        })
      },
    }),
  ],
})
