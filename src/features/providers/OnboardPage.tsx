import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Step = 1 | 2 | 3 | 4;

type BasicInfo = {
  name: string;
  category: string;
};

type LocationInfo = {
  country: string;
  city: string;
  address: string;
};

type ContactInfo = {
  email: string;
  phone: string;
  languages: string[];
};

const CATEGORIES = [
  "Advokat",
  "Doktor opšte prakse",
  "Pedijatar",
  "Veterinar",
  "Knjigovođa",
  "Frizer",
  "Restoran",
  "Kafić",
  "Auto servis",
  "Stolar",
  "Električar",
  "Vodoinstalater",
  "Prevodilac",
  "IT usluge",
] as const;

type CountryOption = {
  code: string;
  name: string;
  cities: string[];
};

const COUNTRIES: CountryOption[] = [
  {
    code: "DE",
    name: "Germany",
    cities: ["Berlin", "Hamburg", "Munich", "Frankfurt", "Cologne"],
  },
  {
    code: "AT",
    name: "Austria",
    cities: ["Vienna", "Graz", "Linz", "Salzburg"],
  },
  {
    code: "CH",
    name: "Switzerland",
    cities: ["Zurich", "Geneva", "Basel", "Bern"],
  },
  {
    code: "RS",
    name: "Serbia",
    cities: ["Belgrade", "Novi Sad", "Niš", "Kragujevac"],
  },
];

type LanguageOption = {
  code: string;
  short: string;
  label: string;
  flag: string;
};

const LANGUAGES: LanguageOption[] = [
  { code: "sr", short: "SR", label: "Serbian", flag: "🇷🇸" },
  { code: "hr", short: "HR", label: "Croatian", flag: "🇭🇷" },
  { code: "bs", short: "BS", label: "Bosnian", flag: "🇧🇦" },
  { code: "mk", short: "MK", label: "Macedonian", flag: "🇲🇰" },
  { code: "sl", short: "SL", label: "Slovenian", flag: "🇸🇮" },
  { code: "en", short: "EN", label: "English", flag: "🇬🇧" },
  { code: "de", short: "DE", label: "German", flag: "🇩🇪" },
  { code: "ru", short: "RU", label: "Russian", flag: "🇷🇺" },
  { code: "uk", short: "UA", label: "Ukrainian", flag: "🇺🇦" },
  { code: "tr", short: "TR", label: "Turkish", flag: "🇹🇷" },
  { code: "ar", short: "AR", label: "Arabic", flag: "🇸🇦" },
];

export default function OnboardPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [basic, setBasic] = useState<BasicInfo>({
    name: "",
    category: "",
  });

  const [location, setLocation] = useState<LocationInfo>({
    country: "",
    city: "",
    address: "",
  });

  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    phone: "",
    languages: [],
  });

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.name === location.country),
    [location.country]
  );

  // -------------------------------
  // Helpers
  // -------------------------------
  function canGoNext(current: Step): boolean {
    if (current === 1) {
      return basic.name.trim().length > 1 && basic.category.trim().length > 0;
    }
    if (current === 2) {
      return (
        location.country.trim().length > 0 && location.city.trim().length > 0
      );
    }
    if (current === 3) {
      return contact.email.trim().length > 3; // phone/lang optional za sad
    }
    return true;
  }

  function goNext() {
    if (!canGoNext(step)) return;
    setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  }

  function goBack() {
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  function toggleLanguage(code: string) {
    setContact((prev) => {
      const exists = prev.languages.includes(code);
      return {
        ...prev,
        languages: exists
          ? prev.languages.filter((c) => c !== code)
          : [...prev.languages, code],
      };
    });
  }

  async function handleSubmit() {
    if (!canGoNext(3)) {
      setStep(3);
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) throw userError;
      if (!userData.user) throw new Error("Not authenticated");

      const payload = {
        name: basic.name.trim(),
        category: basic.category.trim(),
        country: location.country.trim(),
        city: location.city.trim(),
        address: location.address.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        languages: contact.languages.join(","), // isti format kao u EditBusiness
        owner_user_id: userData.user.id,
      };

      const { data, error } = await supabase
        .from("companies")
        .insert(payload)
        .select("*")
        .single();

      if (error) throw error;

      // posle uspešnog upisa vodi ga na profil firme
      if (data?.id) {
        navigate(`/profile/${data.id}`);
      } else {
        navigate("/account");
      }
    } catch (err: any) {
      console.error("Onboard submit error:", err);
      setErrorMsg(
        err?.message || "Something went wrong while saving your business."
      );
      setSaving(false);
      return;
    }

    setSaving(false);
  }

  // -------------------------------
  // UI za step tabs
  // -------------------------------
  const stepsMeta = [
    { id: 1, label: "Basic info" },
    { id: 2, label: "Location" },
    { id: 3, label: "Contact & languages" },
    { id: 4, label: "Review & submit" },
  ] as const;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">
        Add your business
      </h1>
      <p className="text-gray-600 mb-8">
        We’ll guide you through a few quick steps to create your profile on
        Maylo.
      </p>

      {/* STEPS NAV */}
      <div className="flex gap-3 mb-8">
        {stepsMeta.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
              step === s.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 border border-white/40 text-xs">
              {s.id}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* STEP CONTENT */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 md:p-8">
        {step === 1 && (
          <StepBasicInfo basic={basic} setBasic={setBasic} />
        )}

        {step === 2 && (
          <StepLocation
            location={location}
            setLocation={setLocation}
            selectedCountry={selectedCountry}
          />
        )}

        {step === 3 && (
          <StepContactLanguages
            contact={contact}
            setContact={setContact}
            toggleLanguage={toggleLanguage}
          />
        )}

        {step === 4 && (
          <StepReview basic={basic} location={location} contact={contact} />
        )}

        {/* FOOTER BUTTONS */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || saving}
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext(step) || saving}
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Finish"}
            </button>
          )}
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Step {step} of 4
        </p>
      </div>
    </main>
  );
}

// ----------------------------------------
// STEP 1 – BASIC INFO
// ----------------------------------------
function StepBasicInfo({
  basic,
  setBasic,
}: {
  basic: BasicInfo;
  setBasic: (v: BasicInfo) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">
          Business name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={basic.name}
          onChange={(e) =>
            setBasic({ ...basic, name: e.target.value })
          }
          placeholder="e.g. Kobasica"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Category / branch <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
          value={basic.category}
          onChange={(e) =>
            setBasic({ ...basic, category: e.target.value })
          }
        >
          <option value="">Select category…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          This is how users will find you in search (e.g. frizer, advokat,
          lekar…).
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------
// STEP 2 – LOCATION
// ----------------------------------------
function StepLocation({
  location,
  setLocation,
  selectedCountry,
}: {
  location: LocationInfo;
  setLocation: (v: LocationInfo) => void;
  selectedCountry?: CountryOption;
}) {
  const cities = selectedCountry?.cities ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            value={location.country}
            onChange={(e) =>
              setLocation({
                ...location,
                country: e.target.value,
                city: "", // reset city
              })
            }
          >
            <option value="">Select country…</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
            value={location.city}
            onChange={(e) =>
              setLocation({ ...location, city: e.target.value })
            }
            disabled={!location.country}
          >
            <option value="">
              {location.country ? "Select city…" : "Choose country first"}
            </option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={location.address}
          onChange={(e) =>
            setLocation({ ...location, address: e.target.value })
          }
          placeholder="Street and number (optional)"
        />
      </div>
    </div>
  );
}

// ----------------------------------------
// STEP 3 – CONTACT & LANGUAGES
// ----------------------------------------
function StepContactLanguages({
  contact,
  setContact,
  toggleLanguage,
}: {
  contact: ContactInfo;
  setContact: (v: ContactInfo) => void;
  toggleLanguage: (code: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={contact.email}
            onChange={(e) =>
              setContact({ ...contact, email: e.target.value })
            }
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone number
          </label>
          <input
            type="tel"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={contact.phone}
            onChange={(e) =>
              setContact({ ...contact, phone: e.target.value })
            }
            placeholder="+49 123 456 789"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Languages you speak
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Select all languages you can communicate with your clients.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => {
            const active = contact.languages.includes(lang.code);
            return (
              <button
                type="button"
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                  active
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span className="font-medium">{lang.short}</span>
                </span>
                <span className="text-[11px] text-gray-500 hidden sm:inline">
                  {lang.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------
// STEP 4 – REVIEW & SUBMIT
// ----------------------------------------
function StepReview({
  basic,
  location,
  contact,
}: {
  basic: BasicInfo;
  location: LocationInfo;
  contact: ContactInfo;
}) {
  const summary = [
    { label: "Business name", value: basic.name },
    { label: "Category", value: basic.category },
    { label: "Country", value: location.country },
    { label: "City", value: location.city },
    { label: "Address", value: location.address || "—" },
    { label: "Email", value: contact.email },
    { label: "Phone", value: contact.phone || "—" },
    {
      label: "Languages",
      value:
        contact.languages.length > 0
          ? contact.languages.join(", ")
          : "—",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Please review your information before submitting. You’ll be able to edit
        these details later from your account.
      </p>

      <div className="divide-y rounded-xl border border-slate-200 bg-slate-50">
        {summary.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-3 text-sm"
          >
            <span className="text-gray-500">{row.label}</span>
            <span className="font-medium text-gray-900 max-w-xs text-right">
              {row.value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
