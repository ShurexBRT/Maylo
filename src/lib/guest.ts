// session-only "guest" režim + bezbednosni TTL fallback za PWA/iOS slučajeve.

const SS_KEY = 'maylo_guest_ss'     // session flag (briše se kad se zatvori tab/app)
const LS_KEY = 'maylo_guest_ttl'    // fallback TTL timestamp (ms)
const TTL_MS = 2 * 60 * 60 * 1000   // 2h (promeni po želji)

export function isGuest(): boolean {
  // 1) direktno iz sessionStorage
  if (sessionStorage.getItem(SS_KEY) === '1') return true

  // 2) fallback: proveri TTL u localStorage (PWA suspend scenariji)
  const ttl = Number(localStorage.getItem(LS_KEY) || 0)
  const valid = ttl && Date.now() < ttl
  if (valid) {
    // rehidrira session flag ako je tab osvežen a ne zatvoren
    sessionStorage.setItem(SS_KEY, '1')
    return true
  }
  // istekao TTL → očisti fallback
  localStorage.removeItem(LS_KEY)
  return false
}

export function enableGuest() {
  sessionStorage.setItem(SS_KEY, '1')
  localStorage.setItem(LS_KEY, String(Date.now() + TTL_MS))
}

export function disableGuest() {
  sessionStorage.removeItem(SS_KEY)
  localStorage.removeItem(LS_KEY)
}

// Hook-up: očisti session flag na gašenje/napuštanje taba
export function attachGuestAutoLogout() {
  const off = () => {
    sessionStorage.removeItem(SS_KEY)
    // TTL ostavljamo — ako je samo refresh, ostaje guest ali maksimum do isteka TTL-a
  }
  window.addEventListener('pagehide', off)     // mobile/Safari friendly
  window.addEventListener('beforeunload', off) // desktop fallback
  return () => {
    window.removeEventListener('pagehide', off)
    window.removeEventListener('beforeunload', off)
  }
}
