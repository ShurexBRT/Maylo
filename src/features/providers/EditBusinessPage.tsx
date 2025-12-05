// src/features/providers/EditBusinessPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type FormState = {
  name: string;
  category: string;
  country: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  languages: string[];
};

export default function EditBusinessPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState<FormState>({
    name: "",
    category: "",
    country: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    languages: [],
  });

  // ------------------------------------------
  // LOAD BUSINESS DATA
  // ------------------------------------------
  useEffect(() => {
    if (!id) {
      setErrorMsg("Missing company id.");
      setLoading(false);
      return;
    }

    loadCompany();
  }, [id]);

  async function loadCompany() {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Load company error:", error);
      setErrorMsg("Failed to load business.");
      setLoading(false);
      return;
    }

    // --- FIX: Robust parsing languages ---
    let langs: string[] = [];

    if (Array.isArray(data.languages)) {
      // If DB column is text[]
      langs = data.languages
        .map((s: any) => String(s).trim())
        .filter(Boolean);
    } else if (typeof data.languages === "string") {
      // If DB column is text
      langs = data.languages
        .split(",")
        .map((s: any) => s.trim())
        .filter(Boolean);
    } else if (data.languages != null) {
      // As fallback convert to string
      langs = String(data.languages)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    setForm({
      name: data.name ?? "",
      category: data.category ?? "",
      country: data.country ?? "",
      city: data.city ?? "",
      address: data.address ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      languages: langs,
    });

    setLoading(false);
  }

  // ------------------------------------------
  // SAVE CHANGES
  // ------------------------------------------
  async function saveBusiness() {
    if (!id) return;

    setSaving(true);
    setErrorMsg("");

    const payload = {
      ...form,
      languages: form.languages.join(","),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("companies")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("Save error:", error);
      setErrorMsg("Failed to save changes.");
      setSaving(false);
      return;
    }

    setSaving(false);
    nav(`/profile/${id}`);
  }

  // ------------------------------------------
  // RENDER
  // ------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading…</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {errorMsg}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit your business</h1>

      {/* NAME */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Business name</label>
        <input
          type="text"
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* CATEGORY */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Category / branch</label>
        <input
          type="text"
          className="input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </div>

      {/* COUNTRY */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Country</label>
        <input
          type="text"
          className="input"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
      </div>

      {/* CITY */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">City</label>
        <input
          type="text"
          className="input"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
      </div>

      {/* ADDRESS */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Address</label>
        <input
          type="text"
          className="input"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="text"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      {/* PHONE */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Phone</label>
        <input
          type="text"
          className="input"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      {/* LANGUAGES */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Languages</label>
        <input
          type="text"
          className="input"
          value={form.languages.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              languages: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      <button
        onClick={saveBusiness}
        disabled={saving}
        className="btn-primary mt-4"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </main>
  );
}
