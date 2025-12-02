// src/features/provider/OnboardPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type FormState = {
  name: string;
  category: string;
  country: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  languages: string;
};

export default function OnboardPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    category: "",
    country: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    languages: "",
  });

  // auth + guard: dozvoli samo ulogovanom provideru/adminu bez postojećeg biznisa
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: auth, error: authError } =
          await supabase.auth.getUser();

        if (authError) {
          console.error("[Onboard] getUser error:", authError.message);
        }

        const user = auth?.user;

        if (!user) {
          if (!cancelled) {
            nav("/login?next=/provider/onboard", { replace: true });
          }
          return;
        }

        // provera role
        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error(
            "[Onboard] profiles error:",
            profileError.message
          );
          if (!cancelled) {
            setError(profileError.message);
            setLoading(false);
          }
          return;
        }

        if (
          !profile ||
          (profile.role !== "provider" && profile.role !== "admin")
        ) {
          if (!cancelled) {
            setError("Only service providers can access onboarding.");
            setLoading(false);
          }
          return;
        }

        // da li već postoji kompanija
        const {
          data: existing,
          error: companiesError,
        } = await supabase
          .from("companies")
          .select("id")
          .eq("owner_user_id", user.id)
          .maybeSingle();

        if (companiesError) {
          console.error(
            "[Onboard] companies error:",
            companiesError.message
          );
          if (!cancelled) {
            setError(companiesError.message);
            setLoading(false);
          }
          return;
        }

        if (existing?.id) {
          // već ima biznis → na edit profil firme (konzistentno sa AuthCallback)
          if (!cancelled) {
            nav(`/provider/edit/${existing.id}`, { replace: true });
          }
          return;
        }

        // ako user ima email, možemo ga pre-fillovati u formu
        if (!cancelled && user.email) {
          setForm((prev) => ({ ...prev, email: user.email ?? "" }));
        }

        if (!cancelled) setLoading(false);
      } catch (err) {
        console.error("[Onboard] fatal error:", err);
        if (!cancelled) {
          setError("Something went wrong. Please try again later.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      nav("/login?next=/provider/onboard", { replace: true });
      return;
    }

    // trim polja
    const name = form.name.trim();
    const category = form.category.trim();
    const country = form.country.trim();
    const city = form.city.trim();
    const address = form.address?.trim() || "";
    const phone = form.phone?.trim() || "";
    const email = form.email?.trim() || "";
    const languagesRaw = form.languages || "";

    // minimalna validacija
    if (!name || !category || !country || !city) {
      setError("Please fill in all required fields.");
      return;
    }

    const langs = languagesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("companies")
        .insert({
          name,
          category,
          country,
          city,
          address: address || null,
          phone: phone || null,
          email: email || null,
          languages: langs,
          owner_user_id: user.id,
        })
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("[Onboard] insert error:", error.message);
        setError(error.message);
        return;
      }

      if (data?.id) {
        nav(`/profile/${data.id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl p-6 text-center text-slate-600">
        Loading…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Add your business</h1>
      <p className="mb-6 text-slate-600">
        Unesi osnovne informacije. Polja označena * su obavezna. Detalje
        možeš kasnije menjati.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium">
            Name *
          </label>
          <input
            className="field mt-1"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Category *
          </label>
          <input
            className="field mt-1"
            placeholder="frizer, električar, translator…"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">
              Country *
            </label>
            <input
              className="field mt-1"
              value={form.country}
              onChange={(e) =>
                setForm({ ...form, country: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              City *
            </label>
            <input
              className="field mt-1"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Address
          </label>
          <input
            className="field mt-1"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">
              Phone
            </label>
            <input
              className="field mt-1"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Email
            </label>
            <input
              className="field mt-1"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Languages (comma separated)
          </label>
          <input
            className="field mt-1"
            placeholder="sr, de, en"
            value={form.languages}
            onChange={(e) =>
              setForm({ ...form, languages: e.target.value })
            }
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? "Creating…" : "Create business"}
          </button>
        </div>
      </form>
    </main>
  );
}
