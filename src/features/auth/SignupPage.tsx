// src/features/auth/SignupPage.tsx
import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signupEmail } from "./api"; // koristi tvoj api.ts iz auth foldera

type ProviderModalProps = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
};

function ProviderNoticeModal({
  open,
  onClose,
  onAccept,
}: ProviderModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white ring-1 ring-slate-200 shadow-2xl">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            For service providers only
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ova opcija je namenjena kompanijama i samostalnim delatnostima koje žele da objave svoj biznis na Maylo platformi.
          </p>

          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Potrebno je da budeš ovlašćen da predstavljaš biznis.</li>
            <li>Bićeš upitan da dodaš podatke o kompaniji (naziv, adresa, kontakti).</li>
            <li>Prvi period je besplatan po promotivnim uslovima koje objavimo.</li>
          </ul>

          <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5"
            />
            <span>Potvrđujem da predstavljam legalni biznis i da unosim tačne podatke.</span>
          </label>

          <div className="mt-5 flex justify-end gap-2">
            <button className="btn-ghost" onClick={onClose}>Nazad</button>
            <button
              className={`btn-primary ${!confirmed ? "cursor-not-allowed opacity-60" : ""}`}
              disabled={!confirmed}
              onClick={() => {
                onAccept();
                onClose();
              }}
            >
              Razumem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [providerAccepted, setProviderAccepted] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(() => {
    const normalizedEmail = email.trim();
    return (
      normalizedEmail &&
      password.length >= 6 &&
      password === confirm &&
      (!isProvider || providerAccepted)
    );
  }, [email, password, confirm, isProvider, providerAccepted]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await signupEmail({
        email,
        password,
        role: isProvider ? "provider" : "user",
      });
      setSuccess(true);
    } catch (err: any) {
      console.error("[SignupPage] error:", err.message);
      setError(err.message || "Failed to register account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      {!success ? (
        <>
          <h1 className="mb-4 text-2xl font-bold">Create an account</h1>
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field mt-1"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field mt-1 pr-10"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Confirm password</span>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="field mt-1 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={isProvider}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsProvider(checked);
                  if (checked && !providerAccepted) setShowProviderModal(true);
                }}
              />
              <div>
                <div className="flex items-center gap-2 font-medium">
                  I’m a service provider
                  <a
                    href="/faq#providers"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Learn more
                  </a>
                </div>
                <div className="text-sm text-slate-600">
                  Ako predstavljaš kompaniju i želiš da objaviš svoj biznis na Maylo.
                </div>
              </div>
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={`btn-primary w-full ${!canSubmit || loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Check your inbox</h1>
          <p className="text-slate-600">
            Poslali smo ti verifikacioni link. Nakon potvrde, moći ćeš da se prijaviš.
          </p>
        </div>
      )}

      <ProviderNoticeModal
        open={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        onAccept={() => setProviderAccepted(true)}
      />
    </main>
  );
}
