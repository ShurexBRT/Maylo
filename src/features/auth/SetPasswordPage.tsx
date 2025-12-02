// src/features/auth/SetPasswordPage.tsx
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Form = {
  password: string;
  confirm: string;
};

export default function SetPasswordPage() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const pwd = watch("password");

  const onSubmit = async (v: Form) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: v.password,
      });
      if (error) throw error;

      // posle kreiranja lozinke – naravno vodi ga na login
      nav("/login", { replace: true });
    } catch (err) {
      console.error(err);
      // error prikazujemo dole automatski
    }
  };

  const genericError =
    errors.root?.message ??
    "Could not set password. Please try again.";

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Set your password</h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Password */}
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="field mt-1"
            placeholder="New password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm */}
        <div>
          <label className="text-sm font-medium">Confirm password</label>
          <input
            type="password"
            className="field mt-1"
            placeholder="Repeat password"
            {...register("confirm", {
              required: "Please confirm your password",
              validate: (v) =>
                v === pwd || "Passwords do not match",
            })}
          />
          {errors.confirm && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirm.message}
            </p>
          )}
        </div>

        {/* Generic error */}
        {errors.root && (
          <p className="text-sm text-red-600">{genericError}</p>
        )}

        <button
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? "Saving…" : "Save password"}
        </button>
      </form>
    </main>
  );
}
