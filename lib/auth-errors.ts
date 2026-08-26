export function getAuthErrorMessage(code?: string) {
  const messages: Record<string, string> = {
    USER_ALREADY_EXISTS: "An account with this email already exists.",
    INVALID_EMAIL_OR_PASSWORD: "Invalid email or password.",
    INVALID_OTP: "The verification code is invalid.",
    OTP_EXPIRED: "The verification code has expired. Request a new code.",
    TOO_MANY_ATTEMPTS:
      "Too many verification attempts. Request a new code and try again.",
  }

  return messages[code ?? ""] ?? "Something went wrong. Please try again."
}
