import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

// --- isti helperi kao u OnboardPage (možeš kasnije da ih izvučeš u zajednički fajl) ---

type WizardStep = 1 | 2 | 3 | 4;

type BusinessForm = {
  name: string;
  category: string;
  country: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  languages: string[];
};

const INITIAL_FORM: BusinessForm = {
  name: "",
  category: "",
  country: "",
  city: "",
  address: "",
  email: "",
  phone: "",
  languages: [],
};

const BUSINESS_CATEGORIES = [
  "Advokat",
  "Doktor - opšta praksa",
  "Doktor - pedijatar",
  "Veterinar",
  "Knjigovođa",
  "Frizer",
  "Restoran",
  "Kafić",
  "Prevodilac",
  "Auto-mehaničar",
  "Električar",
  "Vodoinstalater",
  "Stolar",
];

const COUNTRIES = ["Germany", "Serbia"] as const;

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  Germany: ["Berlin", "Hamburg", "Munich", "Frankfurt", "Stuttgart"],
  Serbia: ["Beograd", "Novi Sad", "Niš", "Kragujevac"],
};

const LANG_OPTIONS = [
  { code: "sr", label: "SR", flag: "🇷🇸" },
  { code: "hr", label: "HR", flag: "🇭🇷" },
  { code: "bs", label: "BA", flag: "🇧🇦" },
  { code: "mk", label: "MK", flag: "🇲🇰" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "uk", label: "UA", flag: "🇺🇦" },
  { code: "tr", label: "TR", flag: "🇹🇷" },
  { code: "ar", label: "AR", flag: "🇸🇦" },
];

type CompanyRow = {
  id: string;
  name: string | null;
  category: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  languages: string | null;
};

export default function EditBusinessPage() {
  const nav = useNavigate();
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<BusinessForm>(INITIAL_FORM);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // load existing company for logged-in owner
  useEffect(() => {
    let cancelled = false;

    async function loadCompany() {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        nav("/login", { replace: true });
        return;
      }

      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_user_id", user.id)
        .maybeSingle<CompanyRow>();

      if (cancelled) return;

      if (companyError) {
        console.error("[EditBusinessPage] fetch company error:", companyError.message);
      }

      if (!company) {
        // nema firme -> vodi ga na onboarding
        nav("/provider/onboard", { replace: true });
        return;
      }

      setCompanyId(company.id);
      setForm({
        name: company.name ?? "",
        category: company.category ?? "",
        country: company.country ?? "",
        city: company.city ?? "",
        address: company.address ?? "",
        email: company.email ?? "",
        phone: company.phone ?? "",
        languages: company.languages
          ? company.languages.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      });

      setLoading(false);
    }

    loadCompany();

    return () => {
      cancelled = true;
    };
  }, [nav]);

  function handleChange<K extends keyof BusinessForm>(
    key: K,
    value: BusinessForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function toggleLanguage(code: string) {
    setForm((prev) => {
      const exists = prev.languages.includes(code);
      return {
        ...prev,
        languages: exists
          ? prev.languages.filter((c) => c !== code)
          : [...prev.languages, code],
      };
    });
  }

  function validateStep(s: WizardStep): string | null {
    if (s === 1) {
      if (!form.name.trim()) return "Business name is required.";
      if (!form.category) return "Please choose a category.";
    }
    if (s === 2) {
      if (!form.country) return "Country is required.";
      if (!form.city) return "City is required.";
    }
    if (s === 3) {
      if (form.languages.length === 0)
        return "Please select at least one language.";
    }
    return null;
  }

  function handleBack() {
    setError(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : prev));
  }

  function handleNext() {
    const msg = validateStep(step);
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);
    setStep((prev) => (prev < 4 ? ((prev + 1) as WizardStep) : prev));
  }

  async function handleSubmit() {
    if (!companyId) {
      setError("Missing company id.");
      return;
    }

    const msg = validateStep(3);
    if (msg) {
      setError(msg);
      setStep(3);
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      category: form.category,
      country: form.country,
      city: form.city,
      address: form.address.trim() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      languages: form.languages.join(","),
    };

    const { error: updateError } = await supabase
      .from("companies")
      .update(payload)
      .eq("id", companyId);

    setSaving(false);

    if (updateError) {
      console.error("[EditBusinessPage] update error:", updateError.message);
      setError("Failed to update your business. Please try again.");
      return;
    }

    nav("/account");
  }

  if (loading) {
    return (
      <main className="app-page flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="app-page max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Edit your business</h1>
      <p className="text-gray-600 mb-6">
        Update your public profile and keep your info fresh for Maylo users.
      </p>

      {/* stepper */}
      <div className="flex gap-4 mb-6">
        {["Basic info", "Location", "Contact & languages", "Review & submit"].map(
          (label, idx) => {
            const stepNumber = (idx + 1) as WizardStep;
            const active = stepNumber === step;
            const done = stepNumber < step;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm border ${
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : done
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  {stepNumber}
                </div>
                <span
                  className={
                    active ? "text-sm font-medium" : "text-sm text-gray-500"
                  }
                >
                  {label}
                </span>
              </div>
            );
          }
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl bg-white shadow-sm border border-slate-200 px-6 py-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Business name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category / branch <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <option value="">Choose a category…</option>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  value={form.country}
                  onChange={(e) => {
                    const country = e.target.value;
                    handleChange("country", country);
                    handleChange("city", "");
                  }}
                >
                  <option value="">Choose a country…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  disabled={!form.country}
                >
                  <option value="">
                    {form.country ? "Choose a city…" : "Select country first"}
                  </option>
                  {form.country &&
                    (CITIES_BY_COUNTRY[form.country] ?? []).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Address
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Languages you speak <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {LANG_OPTIONS.map((lang) => {
                  const checked = form.languages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => toggleLanguage(lang.code)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                        checked
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      <input
                        type="checkbox"
                        className="pointer-events-none"
                        checked={checked}
                        readOnly
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium mb-2">Review & submit</h2>
            <p className="text-sm text-gray-600 mb-4">
              Double-check your info before saving changes.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-gray-700">Basic info</div>
                <div className="text-gray-600">
                  {form.name || "—"} · {form.category || "—"}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Location</div>
                <div className="text-gray-600">
                  {[form.address, form.city, form.country]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700">
                  Contact & languages
                </div>
                <div className="text-gray-600">
                  {form.email && <div>Email: {form.email}</div>}
                  {form.phone && <div>Phone: {form.phone}</div>}
                  <div>
                    Languages:{" "}
                    {form.languages.length
                      ? form.languages
                          .map(
                            (code) =>
                              LANG_OPTIONS.find((l) => l.code === code)?.label ??
                              code
                          )
                          .join(", ")
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          className="btn-secondary px-5 py-2 rounded-lg border border-slate-300 text-sm"
          onClick={handleBack}
          disabled={step === 1 || saving}
        >
          Back
        </button>

        {step < 4 ? (
          <button
            type="button"
            className="btn-primary px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm"
            onClick={handleNext}
            disabled={saving}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm disabled:opacity-60"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        )}
      </div>
    </main>
  );
}
