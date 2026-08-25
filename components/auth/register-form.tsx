"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/auth-shemas";

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    form.clearErrors("root");

    const { error } =
      await authClient.signUp.email({
        name: "",
        email: values.email,
        password: values.password,
      });

    if (error) {
      form.setError("root", {
        type: "server",
        message: getAuthErrorMessage(error.code),
      });

      return;
    }

    router.replace("/");
    router.refresh();
  };

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid,
      isSubmitting,
    },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="register-email">
          Email
        </label>

        <input
          id="register-email"
          type="email"
          autoComplete="email"
          autoFocus
          aria-invalid={!!errors.email}
          aria-describedby={
            errors.email
              ? "register-email-error"
              : undefined
          }
          {...register("email")}
        />

        {errors.email && (
          <p
            id="register-email-error"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-password">
          Password
        </label>

        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          aria-describedby={
            errors.password
              ? "register-password-error"
              : undefined
          }
          {...register("password")}
        />

        {errors.password && (
          <p
            id="register-password-error"
            role="alert"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p role="alert">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting
          ? "Creating account..."
          : "Create account"}
      </button>

      <p>
        Already have an account?{" "}
        <Link href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}