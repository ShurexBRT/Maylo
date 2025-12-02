// src/features/auth/LoginPage.tsx (ili gde već stoji)

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useLogin, useOAuth } from "./hooks";

type Form = { email: string; password: string };

export default function LoginPage() {
  const nav = useNavigate();
  const login = useLogin();
  const oauth = useOAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (v: Form) => {
    try {
      await login.mutateAsync({ email: v.email, password: v.password });
      nav("/");
    } catch (_e) {
      // error će biti u login.error, prikazujemo ispod
    }
  };

  const social = (p: "google" | "apple" | "facebook") => () =>
    oauth.mutate(p);

  const genericError =
    (login.error as Error | null)?.message &&
    !login.error.message.includes("Not authenticated")
      ? login.error.message
      : "Login failed. Check your credentials and try again.";

  return (
    <main className="mx-auto max-w-sm p-4">
      <h1 className="mb-4 text-xl font-semibold">Log in</h1>

      <form
        className="card space-y-3 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <input
            type="email"
            placeholder="Email"
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

        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password should be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {login.isError && (
          <p className="text-xs text-red-600">{genericError}</p>
        )}

        <button
          className="btn-primary w-full"
          disabled={login.isPending}
        >
          {login.isPending ? "Signing in…" : "Sign in"}
        </button>

        <Link
          to="/forgot"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </Link>
      </form>

      <div className="my-4 text-center text-slate-500">or</div>

      <div className="grid gap-2">
        <button
          onClick={social("google")}
          className="btn-secondary"
          disabled={oauth.isPending}
        >
          Continue with Google
        </button>
        <button
          onClick={social("apple")}
          className="btn-secondary"
          disabled={oauth.isPending}
        >
          Continue with Apple
        </button>
        <button
          onClick={social("facebook")}
          className="btn-secondary"
          disabled={oauth.isPending}
        >
          Continue with Facebook
        </button>
      </div>

      <p className="mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-600 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </main>
  );
}
