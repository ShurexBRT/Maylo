// session-only "guest" režim + bezbednosni TTL fallback za PWA/iOS slučajeve.

const SS_KEY = "maylo_guest_ss"; // session flag (briše se kad se zatvori tab/app)
const LS_KEY = "maylo_guest_ttl"; // fallback TTL timestamp (ms)
const TTL_MS = 2 * 60 * 60 * 1000; // 2h (promeni po želji)

function hasStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined" && typeof window.localStorage !== "undefined";
}

export function isGuest(): boolean {
  if (!hasStorage()) return false;

  try {
    // 1) direktno iz sessionStorage
    if (sessionStorage.getItem(SS_KEY) === "1") return true;

    // 2) fallback: proveri TTL u localStorage (PWA suspend scenariji)
    const ttlRaw = localStorage.getItem(LS_KEY);
    const ttl = Number(ttlRaw || 0);
    const valid = ttl && Date.now() < ttl;

    if (valid) {
      // rehidrira session flag ako je tab osvežen a ne zatvoren
      sessionStorage.setItem(SS_KEY, "1");
      return true;
    }

    // istekao TTL → očisti fallback
    if (ttlRaw) {
      localStorage.removeItem(LS_KEY);
    }
  } catch (err) {
    console.error("[guest] isGuest error:", err);
  }

  return false;
}

export function enableGuest() {
  if (!hasStorage()) return;

  try {
    sessionStorage.setItem(SS_KEY, "1");
    localStorage.setItem(LS_KEY, String(Date.now() + TTL_MS));
  } catch (err) {
    console.error("[guest] enableGuest error:", err);
  }
}

export function disableGuest() {
  if (!hasStorage()) return;

  try {
    sessionStorage.removeItem(SS_KEY);
    localStorage.removeItem(LS_KEY);
  } catch (err) {
    console.error("[guest] disableGuest error:", err);
  }
}

// Hook-up: očisti session flag na gašenje/napuštanje taba
export function attachGuestAutoLogout() {
  if (typeof window === "undefined" || typeof window.addEventListener === "undefined") {
    return () => {};
  }

  const off = () => {
    try {
      if (typeof window !== "undefined" && typeof window.sessionStorage !== "undefined") {
        sessionStorage.removeItem(SS_KEY);
      }
      // TTL ostavljamo — ako je samo refresh, ostaje guest ali maksimum do isteka TTL-a
    } catch (err) {
      console.error("[guest] autoLogout off error:", err);
    }
  };

  window.addEventListener("pagehide", off); // mobile/Safari friendly
  window.addEventListener("beforeunload", off); // desktop fallback

  return () => {
    window.removeEventListener("pagehide", off);
    window.removeEventListener("beforeunload", off);
  };
}
