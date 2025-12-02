// src/features/auth/ResetPasswordPage.tsx
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useResetPassword } from "./hooks";

type Form = {
  password: string;
  confirm: string;
};

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const reset = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (v: Form) => {
    try {
      await reset.mutateAsync(v.password);
      nav("/login");
    } catch {
      // greška je u reset.error, prikazaćemo je ispod
    }
  };

  const genericError = (reset.error as Error | null)?.message
    ? (reset.error as Error).message
    : "Failed to update password. Please try again.";

  return (
    <main className="mx-auto max-w-sm p-4">
      <h1 className="mb-4 text-xl font-semibold">Reset password</h1>

      <form
        className="card space-y-3 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message:
                  "Password should be at least 6 characters long",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            {...register("confirm", {
              required: "Please confirm your password",
              validate: (value) =>
                value === passwordValue || "Passwords do not match",
            })}
          />
          {errors.confirm && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirm.message}
            </p>
          )}
        </div>

        {reset.isError && (
          <p className="text-xs text-red-600">{genericError}</p>
        )}

        <button
          className="btn-primary w-full"
          disabled={reset.isPending}
        >
          {reset.isPending ? "Updating…" : "Update password"}
        </button>
      </form>
    </main>
  );
}
