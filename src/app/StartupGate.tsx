// src/features/auth/StartupGate.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { isGuest } from "@/lib/guest"; // <- helper koji smo pravili ranije

// rute koje su javne i NE treba da se preusmeravaju na /welcome
const PUBLIC_EXACT = new Set<string>([
  "/",
  "/welcome",
  "/login",
  "/signup",
  "/auth/callback",
  "/faq",
  "/terms",
  "/contact",
]);

// prefiksi za rute koje su javne (npr. profil firme, rezultati pretrage)
const PUBLIC_PREFIX = ["/results", "/profile"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIX.some((prefix) => pathname.startsWith(prefix));
}

export default function StartupGate() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // 1) javne rute
      if (isPublicPath(pathname)) return;

      // 2) guest sesija (iz helpera sa TTL-om/sessionStorage)
      if (isGuest()) return;

      // 3) proveri da li je ulogovan user
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("[StartupGate] getUser error:", error.message);
      }

      if (!cancelled && !data?.user) {
        nav("/welcome", { replace: true });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [pathname, nav]);

  return null;
}
