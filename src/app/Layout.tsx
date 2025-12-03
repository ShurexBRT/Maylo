// src/app/Layout.tsx
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Drawer from "@/components/Drawer";
import Footer from "@/components/Footer";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import { useUI } from "@/lib/store";

export default function Layout() {
  const { drawerOpen, setDrawer } = useUI();
  const location = useLocation();

  const closeIfOpen = () => {
    if (drawerOpen) setDrawer(false);
  };

  // On route change → close drawer if open
  useEffect(() => {
    if (drawerOpen) {
      setDrawer(false);
    }
  }, [location.pathname, drawerOpen, setDrawer]);

  return (
    <div className="min-h-screen bg-slate-50" onClick={closeIfOpen}>
      <Header />
      <Drawer />

      <main
        className="max-w-5xl mx-auto px-4 py-4"
        onClick={(e) => e.stopPropagation()} // da normalni klikovi ne pale closeIfOpen
      >
        <Outlet />
        <PWAInstallBanner />
      </main>

      <Footer />
    </div>
  );
}
