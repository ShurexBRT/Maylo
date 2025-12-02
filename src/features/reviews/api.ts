// src/features/reviews/api.ts
import { supabase } from "@/lib/supabase";

export type CreateReviewInput = {
  company_id: string;
  rating: number;
  comment?: string;
  visit_date?: string | null;
};

export async function createReview(input: CreateReviewInput) {
  // 1) auth
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("[createReview] getUser error:", authError.message);
  }
  if (!auth?.user) throw new Error("Not authenticated");

  // 2) osnovna validacija
  const rating = Math.round(input.rating);
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const comment =
    input.comment && input.comment.trim().length > 0
      ? input.comment.trim()
      : null;

  const visitDate = input.visit_date ?? null;

  // 3) insert
  const { error: e1 } = await supabase.from("reviews").insert({
    company_id: input.company_id,
    user_id: auth.user.id,
    rating,
    comment,
    visit_date: visitDate,
  });

  if (e1) {
    console.error("[createReview] insert error:", e1.message);
    throw e1;
  }

  // 4) recalculacija proseka i broja ocena
  const { data: all, error: e2 } = await supabase
    .from("reviews")
    .select("rating")
    .eq("company_id", input.company_id);

  if (e2) {
    console.error("[createReview] select ratings error:", e2.message);
    throw e2;
  }

  const ratings = (all ?? []).map((r: any) => Number(r.rating) || 0);
  const count = ratings.length;
  const avg =
    count > 0
      ? ratings.reduce((sum, val) => sum + val, 0) / count
      : 0;

  // 5) upiši na company
  const { error: e3 } = await supabase
    .from("companies")
    .update({
      rating_avg: avg,
      rating_count: count,
    })
    .eq("id", input.company_id);

  if (e3) {
    console.error("[createReview] update company error:", e3.message);
    throw e3;
  }

  // 6) vrati info – za sada ga ne koristiš, ali je korisno imati
  return {
    ok: true as const,
    rating_avg: avg,
    rating_count: count,
  };
}
