// src/app/StartupGate.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Props = {
  children: React.ReactNode;
};

export default function StartupGate({ children }: Props) {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function boot() {
      try {
        // Ako imaš neki svoj startup flow, ostavi — ovo je bezbedan minimum
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        // primer: ako nisi ulogovan i ideš na provider/account rute -> baci na login
        const path = location.pathname;
        const isProtected =
          path.startsWith("/provider") ||
          path.startsWith("/account") ||
          path.startsWith("/settings");

        if (!session && isProtected) {
          navigate("/login", { replace: true });
          return;
        }
      } finally {
        if (isMounted) setReady(true);
      }
    }

    boot();
    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-4">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
