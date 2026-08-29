import { betterAuth } from "better-auth"
import { emailOTP, genericOAuth, yandex } from "better-auth/plugins"
import { Pool } from "pg"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)
const resendFrom =
  process.env.RESEND_FROM_EMAIL ?? "Chatbot <onboarding@resend.dev>"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

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

  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void resend.emails.send({
        from: resendFrom,
        to: user.email,
        subject: "Reset your password",
        text: `Reset your password by opening this link: ${url}`,
      })
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
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
    genericOAuth({
      config: [
        yandex({
          clientId: process.env.YANDEX_CLIENT_ID!,
          clientSecret: process.env.YANDEX_CLIENT_SECRET!,
          scopes: ["login:info", "login:email"],
        }),
      ],
    }),
  ],
})
