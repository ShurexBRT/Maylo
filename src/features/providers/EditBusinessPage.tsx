// src/features/provider/EditBusinessPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

type CompanyRow = {
  id: string;
  name: string;
  category: string;
  country: string;
  city: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  languages: string[] | null;
  owner_user_id: string;
};

export default function EditBusinessPage() {
  const nav = useNavigate();
  const { id: routeId } = useParams<{ id?: string }>();

  const [companyId, setCompanyId] = useState<string | null>(null);
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guard + učitavanje postojeće firme
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // auth
        const { data: auth, error: authError } =
          await supabase.auth.getUser();

        if (authError) {
          console.error("[EditBusiness] getUser error:", authError.message);
        }

        const user = auth?.user;
        if (!user) {
          if (!cancelled) {
            nav("/login?next=/provider/edit", { replace: true });
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
            "[EditBusiness] profiles error:",
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
            setError("Only service providers can edit a business.");
            setLoading(false);
          }
          return;
        }

        // Učitaj firmu:
        // 1) Ako imamo route param id → tražimo po id
        // 2) Ako nema → tražimo po owner_user_id
        let companyQuery = supabase
          .from("companies")
          .select("*")
          .limit(1);

        if (routeId) {
          companyQuery = companyQuery.eq("id", routeId);
        } else {
          companyQuery = companyQuery.eq("owner_user_id", user.id);
        }

        const { data: rows, error: companyError } =
          await companyQuery.returns<CompanyRow[]>();

        if (companyError) {
          console.error(
            "[EditBusiness] companies error:",
            companyError.message
          );
          if (!cancelled) {
            setError(companyError.message);
            setLoading(false);
          }
          return;
        }

        const company = rows?.[0];

        if (!company) {
          // nema firme → vodi na onboard
          if (!cancelled) {
            nav("/provider/onboard", { replace: true });
          }
          return;
        }

        // Bezbednost: dodatni check da user ne uređuje tuđu firmu
        if (company.owner_user_id !== user.id && profile.role !== "admin") {
          if (!cancelled) {
            setError("You are not allowed to edit this business.");
            setLoading(false);
          }
          return;
        }

        // Prefill form
        if (!cancelled) {
          setCompanyId(company.id);
          setForm({
            name: company.name ?? "",
            category: company.category ?? "",
            country: company.country ?? "",
            city: company.city ?? "",
            address: company.address ?? "",
            phone: company.phone ?? "",
            email: company.email ?? "",
            languages: (company.languages ?? []).join(", "),
          });
          setLoading(false);
        }
      } catch (err) {
        console.error("[EditBusiness] fatal error:", err);
        if (!cancelled) {
          setError("Something went wrong. Please try again later.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nav, routeId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!companyId) {
      setError("Business not loaded.");
      return;
    }

    // trim values
    const name = form.name.trim();
    const category = form.category.trim();
    const country = form.country.trim();
    const city = form.city.trim();
    const address = form.address?.trim() || "";
    const phone = form.phone?.trim() || "";
    const email = form.email?.trim() || "";
    const languagesRaw = form.languages || "";

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
      const { error: updateError } = await supabase
        .from("companies")
        .update({
          name,
          category,
          country,
          city,
          address: address || null,
          phone: phone || null,
          email: email || null,
          languages: langs,
        })
        .eq("id", companyId);

      if (updateError) {
        console.error(
          "[EditBusiness] update error:",
          updateError.message
        );
        setError(updateError.message);
        return;
      }

      nav(`/profile/${companyId}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-xl p-6 text-center text-slate-600">
        Loading business…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Edit your business</h1>
      <p className="mb-6 text-sm text-slate-600">
        Update details about your business. You can change these
        fields at any time.
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
            {submitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
