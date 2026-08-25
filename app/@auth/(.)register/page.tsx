import { RegisterForm } from "@/components/auth/register-form";
import { AuthModal } from "@/components/auth/auth-modal";

export default function RegisterModalPage() {
  return (
    <AuthModal>
      <h1>Create an account</h1>
      <p>Get started with your account.</p>
      <RegisterForm />
    </AuthModal>
  );
}