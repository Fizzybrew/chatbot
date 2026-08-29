import { betterAuth } from "better-auth"
import { passkey } from "@better-auth/passkey"
import { emailOTP } from "better-auth/plugins"
import { Pool } from "pg"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)
const resendFrom =
  process.env.RESEND_FROM_EMAIL ?? "Chatbot <onboarding@resend.dev>"

const authBaseURL =
  process.env.BETTER_AUTH_URL ?? "http://localhost:3000"
const authOrigin = new URL(authBaseURL)

export const auth = betterAuth({
  baseURL: authBaseURL,

  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    window: 60,
    max: 100,
  },

  account: {
    accountLinking: {
      enabled: true,
      disableImplicitLinking: false,
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [
    passkey({
      rpID: authOrigin.hostname,
      rpName: "Chatbot",
      origin: authOrigin.origin,
    }),
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
