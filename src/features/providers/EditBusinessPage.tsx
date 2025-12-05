import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import BusinessWizard, {
  BusinessFormValues,
} from "./BusinessWizard";

export default function EditBusinessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("id");

  const [initialValues, setInitialValues] =
    useState<BusinessFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setLoadError("Missing company id.");
      setLoading(false);
      return;
    }

    async function fetchCompany() {
      try {
        setLoading(true);
        setLoadError(null);

        const { data, error } = await supabase
          .from("companies")
          .select("*")
          .eq("id", companyId)
          .single();

        if (error) throw error;
        if (!data) {
          throw new Error("Company not found.");
        }

        const langsRaw = data.languages;
        let languages: string[] = [];

        if (Array.isArray(langsRaw)) {
          languages = langsRaw.filter(Boolean);
        } else if (typeof langsRaw === "string") {
          languages = langsRaw
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        const mapped: BusinessFormValues = {
          name: data.name ?? "",
          category: data.category ?? "",
          country: data.country ?? "",
          city: data.city ?? "",
          address: data.address ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          languages,
        };

        setInitialValues(mapped);
      } catch (err: any) {
        console.error("fetchCompany error:", err);
        setLoadError(err?.message || "Failed to load company data.");
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [companyId]);

  async function handleUpdate(values: BusinessFormValues) {
    if (!companyId) throw new Error("Missing company id.");

    const payload = {
      name: values.name.trim(),
      category: values.category.trim(),
      country: values.country.trim(),
      city: values.city.trim(),
      address: values.address.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      languages: values.languages.join(","), // isti format kao kod create-a
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("companies")
      .update(payload)
      .eq("id", companyId);

    if (error) throw error;

    navigate(`/profile/${companyId}`);
  }

  if (!companyId) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          Edit your business
        </h1>
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Missing company id.
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          Edit your business
        </h1>
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      </main>
    );
  }

  return (
    <BusinessWizard
      mode="edit"
      initialValues={initialValues || undefined}
      loadingInitial={loading}
      onSubmit={handleUpdate}
    />
  );
}
