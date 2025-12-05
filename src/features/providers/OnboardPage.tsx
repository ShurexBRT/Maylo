import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import BusinessWizard, {
  BusinessFormValues,
} from "./BusinessWizard";

export default function OnboardPage() {
  const navigate = useNavigate();

  async function handleCreate(values: BusinessFormValues) {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError) throw userError;
    if (!userData.user) throw new Error("Not authenticated");

    const payload = {
      name: values.name.trim(),
      category: values.category.trim(),
      country: values.country.trim(),
      city: values.city.trim(),
      address: values.address.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      languages: values.languages.join(","), // string u bazi
      owner_user_id: userData.user.id,
    };

    const { data, error } = await supabase
      .from("companies")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

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
      initialValues={undefined}
    />
  );
}
