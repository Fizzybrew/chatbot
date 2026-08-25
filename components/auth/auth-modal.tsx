"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type AuthModalProps = {
  children: ReactNode;
};

export function AuthModal({
  children,
}: AuthModalProps) {
  const router = useRouter();

  return (
    <div
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={() => router.back()}
      >
        Close
      </button>

      {children}
    </div>
  );
}