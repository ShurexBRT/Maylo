// src/features/auth/ForgotPasswordPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useForgotPassword } from "./hooks";

type Form = { email: string };

export default function ForgotPasswordPage() {
  const forgot = useForgotPassword();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: { email: "" },
  });

  const onSubmit = async (v: Form) => {
    setSent(false);
    try {
      await forgot.mutateAsync(v.email.trim());
      setSent(true);
    } catch {
      // greška će biti u forgot.error, prikazaćemo je ispod
    }
  };

  const genericError = (forgot.error as Error | null)?.message
    ? (forgot.error as Error).message
    : "Could not send reset email. Please try again.";

  return (
    <main className="mx-auto max-w-sm p-4">
      <h1 className="mb-4 text-xl font-semibold">Forgot password</h1>

      <form
        className="card space-y-3 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <input
            type="email"
            placeholder="Your email"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {forgot.isError && !sent && (
          <p className="text-xs text-red-600">{genericError}</p>
        )}

        {sent && !forgot.isError && (
          <p className="text-xs text-green-700">
            Check your email for the reset link.
          </p>
        )}

        <button
          className="btn-primary w-full"
          disabled={forgot.isPending}
        >
          {forgot.isPending ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </main>
  );
}
