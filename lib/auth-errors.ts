import { authClient } from "@/lib/auth-client";

export function getAuthErrorMessage(
  code?: string,
) {
  const messages: Record<string, string> = {
    USER_ALREADY_EXISTS:
      "An account with this email already exists.",

    INVALID_EMAIL_OR_PASSWORD:
      "Invalid email or password.",
  };

  return (
    (code && messages[code]) ??
    "Something went wrong. Please try again."
  );
}