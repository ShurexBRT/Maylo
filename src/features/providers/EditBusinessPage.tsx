// src/features/providers/EditBusinessPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import BusinessWizard, { BusinessFormValues } from "./BusinessWizard";

export default function EditBusinessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [initialValues, setInitialValues] = useState<BusinessFormValues | null>(
    null
  );
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ─────────────────────────────────────
  // 1) Učitavanje firme
  // ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingInitial(true);
      setLoadError(null);

      const idFromUrl = searchParams.get("id");

      // user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        if (!cancelled) {
          setLoadError(userError.message);
          setLoadingInitial(false);
        }
        return;
      }
      if (!user) {
        if (!cancelled) {
          setLoadError("You need to be logged in.");
          setLoadingInitial(false);
        }
        return;
      }

      let effectiveId = idFromUrl;

      // ako nema id u URL-u → probaj da nađeš firmu po owner_user_id
      if (!effectiveId) {
        const { data: owned, error: ownedErr } = await supabase
          .from("companies")
          .select("id")
          .eq("owner_user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (ownedErr) {
          if (!cancelled) {
            setLoadError(ownedErr.message);
            setLoadingInitial(false);
          }
          return;
        }

        effectiveId = owned?.id ?? null;
      }

      if (!effectiveId) {
        if (!cancelled) {
          setLoadError("No company found for this account.");
          setLoadingInitial(false);
        }
        return;
      }

      const { data, error: companyErr } = await supabase
        .from("companies")
        .select(
          "id, name, category, country, city, address, email, phone, languages"
        )
        .eq("id", effectiveId)
        .maybeSingle();

      if (companyErr) {
        if (!cancelled) {
          setLoadError(companyErr.message);
          setLoadingInitial(false);
        }
        return;
      }

      if (!data) {
        if (!cancelled) {
          setLoadError("Company not found.");
          setLoadingInitial(false);
        }
        return;
      }

      const langs =
        Array.isArray(data.languages) && data.languages.length > 0
          ? data.languages.map((l: any) => String(l))
          : [];

      const values: BusinessFormValues = {
        name: data.name ?? "",
        category: data.category ?? "",
        country: data.country ?? "",
        city: data.city ?? "",
        address: data.address ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        languages: langs,
      };

      if (!cancelled) {
        setCompanyId(data.id);
        setInitialValues(values);
        setLoadingInitial(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  // ─────────────────────────────────────
  // 2) Submit (update)
  // ─────────────────────────────────────
  async function handleUpdate(values: BusinessFormValues) {
    if (!companyId) {
      throw new Error("Missing company id.");
    }

    const payload = {
      name: values.name.trim(),
      category: values.category.trim(),
      country: values.country,
      city: values.city,
      address: values.address?.trim() || null,
      email: values.email.trim(),
      phone: values.phone.trim(),
      languages: values.languages, // opet: niz stringova za text[]
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("companies")
      .update(payload)
      .eq("id", companyId);

    if (error) {
      console.error("[EditBusinessPage] update error:", error.message);
      throw error;
    }

    navigate(`/profile/${companyId}`);
  }

  // ─────────────────────────────────────
  // 3) Render
  // ─────────────────────────────────────
  if (loadError) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-semibold">Edit your business</h1>
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      </main>
    );
  }

  return (
    <BusinessWizard
      mode="edit"
      initialValues={initialValues ?? undefined}
      loadingInitial={loadingInitial}
      onSubmit={handleUpdate}
    />
  );
}
