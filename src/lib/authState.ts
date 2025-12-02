// src/lib/authState.ts
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type Profile = {
  id: string;
  full_name: string | null;
  role: "user" | "provider" | "admin";
};

export function useSession() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!mounted) return;

        if (error) {
          console.error("[useSession] getUser error:", error.message);
          setUserId(null);
        } else {
          setUserId(data?.user?.id ?? null);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("[useSession] getUser exception:", err);
        setUserId(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      try {
        sub?.subscription?.unsubscribe?.();
      } catch (err) {
        console.error("[useSession] unsubscribe error:", err);
      }
    };
  }, []);

  return { userId, loading };
}

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(!!userId);

  useEffect(() => {
    let mounted = true;

    if (!userId) {
      setProfile(null);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("id", userId)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error("[useProfile] error:", error.message);
          setProfile(null);
        } else {
          setProfile(data as Profile);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("[useProfile] exception:", err);
        setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { profile, loading };
}

export function useCanAddBusiness(userId: string | null, role?: Profile["role"]) {
  const [can, setCan] = useState(false);

  useEffect(() => {
    let mounted = true;

    // ako user nije provider/admin → nema dodavanja biznisa
    if (!userId || !(role === "provider" || role === "admin")) {
      setCan(false);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("id")
          .eq("owner_user_id", userId)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error("[useCanAddBusiness] error:", error.message);
          setCan(false);
        } else {
          // true ako NE postoji firma
          setCan(!data?.id);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("[useCanAddBusiness] exception:", err);
        setCan(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId, role]);

  return can;
}
