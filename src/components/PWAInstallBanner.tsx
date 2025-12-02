import { useEffect, useState } from "react";
import { usePWAInstall } from "@/pwa/usePWAInstall";

const DISMISS_KEY = "maylo_pwa_dismissed";

export default function PWAInstallBanner() {
  const { canInstall, promptInstall, installed } = usePWAInstall();
  const [hidden, setHidden] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detekcija iOS-a – bez pucanja u okruženjima bez window/navigator
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
      const ua = window.navigator.userAgent;
      setIsIOS(/iphone|ipad|ipod/i.test(ua));
    }
  }, []);

  // Ako je već instalirano ili je user ranije odbio banner → sakrij
  useEffect(() => {
    if (installed) {
      setHidden(true);
      return;
    }

    if (typeof window !== "undefined") {
      const dismissed = window.localStorage.getItem(DISMISS_KEY);
      if (dismissed === "1") {
        setHidden(true);
      }
    }
  }, [installed]);

  const handleClose = () => {
    setHidden(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, "1");
    }
  };

  // iOS nema beforeinstallprompt – po tvojim komentarima ovde ga ne prikazujemo
  if (hidden || isIOS || !canInstall) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-lg">
        <img
          src="/icons/maylo-192.png"
          alt="Maylo"
          className="h-8 w-8"
        />
        <div className="text-sm">
          <div className="font-semibold">Install Maylo</div>
          <div className="text-gray-600">
            Get quick access from your home screen
          </div>
        </div>
        <button
          onClick={promptInstall}
          className="btn-primary ml-3 rounded-xl px-3 py-2"
        >
          Install
        </button>
        <button
          onClick={handleClose}
          className="ml-1 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
