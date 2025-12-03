// src/features/settings/SettingsPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "@/lib/supabase";
import { useAuthUser, useLogout } from "@/features/auth/hooks";
import { useSession, useProfile, useCanAddBusiness } from "@/lib/authState";

export default function SettingsPage() {
  const navigate = useNavigate();

  // auth info
  const { data: authUser, isLoading: authLoading } = useAuthUser();
  const { userId, loading: sessionLoading } = useSession();
  const { profile, loading: profileLoading } = useProfile(userId);
  const canAddBusiness = useCanAddBusiness(userId, profile?.role);

  const logout = useLogout();

  // change password
  const [password, setPassword] = useState("");
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [passLoading, setPassLoading] = useState(false);

  // language preference (frontend only za sad)
  const [language, setLanguage] = useState<string>("en");

  const loading = authLoading || sessionLoading || profileLoading;

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassMsg(null);
    if (!password || password.length < 6) {
      setPassMsg("Password must be at least 6 characters.");
      return;
    }

    setPassLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setPassMsg(error.message);
      } else {
        setPassMsg("Password updated successfully.");
        setPassword("");
      }
    } finally {
      setPassLoading(false);
    }
  }

  const onLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate("/login");
    } catch (err) {
      console.error("[Settings] logout error:", err);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6 text-center text-slate-600">
        Loading settings…
      </main>
    );
  }

  if (!authUser || !userId) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <h1 className="mb-2 text-xl font-semibold">
          You&apos;re not logged in
        </h1>
        <p className="mb-4 text-slate-600">
          Log in to manage your account and settings.
        </p>
        <Link to="/login" className="btn-primary">
          Go to login
        </Link>
      </main>
    );
  }

  const role =
    profile?.role === "provider"
      ? "Service provider"
      : profile?.role === "admin"
      ? "Admin"
      : "User";

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="mb-2 text-2xl font-bold">Account & Settings</h1>
      <p className="text-sm text-slate-600">
        Manage your account details, provider business and security.
      </p>

      {/* Account overview */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Account
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium">{authUser.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium">{role}</dd>
          </div>
        </dl>
      </section>

      {/* Provider block */}
      {profile?.role === "provider" || profile?.role === "admin" ? (
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">
            Service provider
          </h2>
          <p className="mb-3 text-sm text-slate-600">
            Manage your business listing on Maylo.
          </p>

          {canAddBusiness ? (
            <Link to="/provider/onboard" className="btn-primary">
              Add your business
            </Link>
          ) : (
            <Link to="/provider/edit" className="btn-primary">
              Edit your business
            </Link>
          )}
        </section>
      ) : null}

      {/* Security / change password */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Security
        </h2>

        <form className="space-y-3" onSubmit={onChangePassword}>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              Change password
            </span>
            <input
              type="password"
              minLength={6}
              className="field w-full"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {passMsg && (
            <p className="text-xs text-slate-600">{passMsg}</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={passLoading}
          >
            {passLoading ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>

      {/* Preferences */}
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">
          Preferences
        </h2>

        <div className="space-y-3 text-sm">
          <div>
            <label className="mb-1 block font-medium">Language</label>
            <select
              className="field w-full"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="sr">Srpski</option>
              <option value="bs">Bosanski</option>
              <option value="hr">Hrvatski</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              For now this only affects your preference. Full
              multi-language UI is coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* Shortcuts + logout */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/saved"
          className="text-sm text-blue-600 hover:underline"
        >
          View saved providers
        </Link>

        <button
          onClick={onLogout}
          disabled={logout.isPending}
          className="text-sm font-semibold text-red-600 hover:underline"
        >
          {logout.isPending ? "Logging out…" : "Log out"}
        </button>
      </section>
    </main>
  );
}
