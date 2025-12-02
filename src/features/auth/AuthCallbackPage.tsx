// src/features/auth/AuthCallbackPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // 1) Čekamo session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[AuthCallback] getSession error:", sessionError.message);
        }

        if (!session) {
          if (!cancelled) navigate("/login", { replace: true });
          return;
        }

        const user = session.user;
        const userId = user.id;

        // 2) Sync-uj React Query auth cache
        qc.setQueryData(["authUser"], user);

        // 3) Povuci profil (role) – može da kasni ako je tek kreiran
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();

        if (profileError) {
          console.error(
            "[AuthCallback] profiles error:",
            profileError.message
          );
        }

        const role = profile?.role ?? "user";

        // 4) Ako je provider → proveri da li ima kompaniju
        if (role === "provider") {
          const { data: owned, error: companyError } = await supabase
            .from("companies")
            .select("id")
            .eq("owner_user_id", userId)
            .maybeSingle();

          if (companyError) {
            console.error(
              "[AuthCallback] companies error:",
              companyError.message
            );
          }

          if (!cancelled) {
            if (!owned) {
              // nema još biznis → vodi ga na onboard
              navigate("/provider/onboard", { replace: true });
            } else {
              // već ima biznis → edit
              navigate(`/provider/edit/${owned.id}`, { replace: true });
            }
          }
          return;
        }

        // 5) Regular user – vodi na account ili home (po želji)
        if (!cancelled) {
          navigate("/account", { replace: true });
        }
      } catch (err) {
        console.error("[AuthCallback] fatal error:", err);
        if (!cancelled) navigate("/login", { replace: true });
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate, qc]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-2 text-sm font-medium text-slate-600">
          Signing you in…
        </div>
        <div className="text-xs text-slate-500">
          Please wait while we prepare your account.
        </div>
      </div>
    </main>
  );
}
