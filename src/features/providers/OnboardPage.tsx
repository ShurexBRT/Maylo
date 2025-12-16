// src/features/providers/OnboardPage.tsx
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import BusinessWizard, { BusinessFormValues } from "./BusinessWizard";

export default function OnboardPage() {
  const navigate = useNavigate();

  async function handleCreate(values: BusinessFormValues) {
    // 1) user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("[OnboardPage] getUser error:", userError.message);
      throw userError;
    }
    if (!user) {
      throw new Error("You need to be logged in to add a business.");
    }

    // 2) priprema payload-a
    const payload = {
      name: values.name.trim(),
      category: values.category.trim(),
      country: values.country,
      city: values.city,
      address: values.address?.trim() || null,
      email: values.email.trim(),
      phone: values.phone.trim(),
      // KLJUČNO: ovo je text[] kolona → šaljemo niz stringova
      languages: values.languages,
      owner_user_id: user.id,
    };

    const { data, error } = await supabase
      .from("companies")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error("[OnboardPage] insert company error:", error.message);
      throw error;
    }

    // 3) redirect – ako imamo id, vodi na profil firme, inače bar na account
    if (data?.id) {
      navigate(`/profile/${data.id}`);
    } else {
      navigate("/account");
    }
  }

  return (
    <BusinessWizard
      mode="create"
      onSubmit={handleCreate}
      loadingInitial={false}
    />
  );
}
