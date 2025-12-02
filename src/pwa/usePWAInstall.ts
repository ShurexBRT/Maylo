// src/pwa/PWAInstallBanner.tsx
import { useEffect, useState } from "react";
import { usePWAInstall } from "@/pwa/usePWAInstall";

const DISMISS_KEY = "maylo_pwa_install_dismissed";

function getInitialDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export default function PWAInstallBanner() {
  const { canInstall, promptInstall, installed, supported } = usePWAInstall();
  const [hidden, setHidden] = useState<boolean>(getInitialDismissed);
  const [isIOS, setIsIOS] = useState(false);

  // detekcija iOS-a – samo u browseru
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent || "";
    setIsIOS(/iphone|ipad|ipod/i.test(ua));
  }, []);

  // sakrij ako je app instalirana
  useEffect(() => {
    if (installed) {
      setHidden(true);
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        // ignore
      }
    }
  }, [installed]);

  // kad user ručno zatvori banner (✕) – zapamti
  const onClose = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  // uslovi da se uopšte prikaže:
  // - nije ručno/automatski sakriven
  // - nije iOS (nema beforeinstallprompt)
  // - browser podržava PWA prompt
  // - ima deferovan event (canInstall)
  if (hidden || isIOS || !supported || !canInstall) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-lg">
        <img
          src="/icons/icon-192.png"
          alt="Maylo"
          className="h-8 w-8"
        />
        <div className="text-sm">
          <div className="font-semibold">Install Maylo</div>
          <div className="text-gray-600">
            Get quick access from your home screen.
          </div>
        </div>
        <button
          onClick={promptInstall}
          className="btn-primary ml-3 rounded-xl px-3 py-2"
        >
          Install
        </button>
        <button
          onClick={onClose}
          className="ml-1 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
