// src/features/auth/SignupPage.tsx
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";

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
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      {/* dialog */}
      <div
        className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white ring-1 ring-slate-200 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            For service providers only
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Ova opcija je namenjena kompanijama i samostalnim
            delatnostima koje žele da objave svoj biznis na Maylo
            platformi. Ako si regularan korisnik koji traži usluge,
            <strong> ne treba</strong> da uključuješ ovu opciju.
          </p>

          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Potrebno je da budeš ovlašćen da predstavljaš biznis.</li>
            <li>
              Bićeš upitan/-na da dodaš podatke o kompaniji (naziv,
              adresa, kontakti, kategorije).
            </li>
            <li>
              Prvi period je besplatan po promotivnim uslovima koje
              objavimo.
            </li>
          </ul>

          <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Potvrđujem da predstavljam legalni biznis i prihvatam da
              unesem tačne podatke.
            </span>
          </label>

          <div className="mt-5 flex justify-end gap-2">
            <button className="btn-ghost" onClick={onClose}>
              Nazad
            </button>
            <button
              className={`btn-primary ${
                !confirmed ? "cursor-not-allowed opacity-60" : ""
              }`}
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
  const [isProvider, setIsProvider] = useState(false);
  const [providerAccepted, setProviderAccepted] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);

  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    const normalizedEmail = email.trim();
    if (!isProvider) return !!normalizedEmail;
    return !!normalizedEmail && providerAccepted;
  }, [email, isProvider, providerAccepted]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);

    try {
      // passwordless tok – magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          // beležimo rolu u user_metadata
          data: { role: isProvider ? "provider" : "user" },
        },
      });

      if (error) {
        console.error("[Signup] signInWithOtp error:", error.message);
        setError(
          error.message ||
            "Something went wrong while sending the confirmation link."
        );
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      {!sent ? (
        <>
          <h1 className="mb-4 text-2xl font-bold">Sign up</h1>
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

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={isProvider}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsProvider(checked);
                  // otvori modal kada se prvi put uključi opcija
                  if (checked && !providerAccepted) {
                    setShowProviderModal(true);
                  }
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
                  Ako predstavljaš kompaniju i želiš da objaviš svoj
                  biznis na Maylo.
                </div>
              </div>
            </label>

            {isProvider && !providerAccepted && (
              <p className="mt-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Potrebno je da potvrdiš upozorenje pre kreiranja naloga
                (klikom na “I’m a service provider” otvara se prozor sa
                detaljima).
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={`btn-primary w-full ${
                !canSubmit || loading
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
            >
              {loading ? "Sending link…" : "Send confirmation link"}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Check your inbox</h1>
          <p className="text-slate-600">
            Poslali smo ti verifikacioni link. Nakon potvrde, vodićemo
            te da postaviš lozinku.
          </p>
        </div>
      )}

      {/* Modal upozorenje za providere */}
      <ProviderNoticeModal
        open={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        onAccept={() => setProviderAccepted(true)}
      />
    </main>
  );
}
