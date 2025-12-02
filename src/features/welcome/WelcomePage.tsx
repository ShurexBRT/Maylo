// src/features/welcome/WelcomePage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import welcomeImg from "@/assets/illustrations/welcome.png";

import { enableGuest, disableGuest, isGuest } from "@/lib/guest";
import { supabase } from "@/lib/supabase";

export default function WelcomePage() {
  const nav = useNavigate();

  // Ako je user logoutovan i došao na Welcome → očistimo guest flag
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();

      // Ako nema sesije → očisti stari guest flag
      if (!data?.user) {
        disableGuest();
      }
      // Ako ima sesiju — ne diramo nista
    })();
  }, []);

  const onGuest = () => {
    enableGuest();
    nav("/", { replace: true });
  };

  return (
    <main className="max-w-md mx-auto px-4 py-10 text-center">
      <img
        src={welcomeImg}
        alt="Maylo welcomes you"
        className="w-56 mx-auto mb-6"
        loading="eager"
      />

      <h1 className="text-2xl font-bold mb-2">Welcome to Maylo</h1>
      <p className="text-gray-600 mb-8">
        Find local services in the language you understand.
      </p>

      <div className="flex flex-col gap-3">
        <Link to="/login" className="btn-primary">
          Log in
        </Link>

        <Link to="/signup" className="btn-secondary">
          Sign up
        </Link>

        <button onClick={onGuest} className="btn-ghost">
          Continue as guest
        </button>
      </div>
    </main>
  );
}
