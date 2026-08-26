import { auth } from "@/lib/auth"
import { passwordSchema } from "@/lib/auth-schemas"
import { headers } from "next/headers"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const result = passwordSchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      { message: result.error.issues[0]?.message ?? "Invalid password." },
      { status: 400 },
    )
  }

  try {
    await auth.api.setPassword({
      body: {
        newPassword: result.data.password,
      },
      headers: await headers(),
    })

    return Response.json({ success: true })
  } catch {
    return Response.json(
      { message: "Unable to create password. Please sign in again." },
      { status: 401 },
    )
  }
}
