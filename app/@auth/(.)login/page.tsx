import { LoginForm } from "@/components/auth/login-form";
import { AuthModal } from "@/components/auth/auth-modal";

export default function LoginModalPage() {
  return (
    <AuthModal>
      <h1>Sign in</h1>
      <p>Sign in to continue.</p>
      <LoginForm />
    </AuthModal>
  );
}