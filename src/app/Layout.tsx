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

  // On route change → close drawer if open
  useEffect(() => {
    if (drawerOpen) {
      setDrawer(false);
    }
  }, [location.pathname, drawerOpen, setDrawer]);

  const handleMainClick = () => {
    if (drawerOpen) {
      setDrawer(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <Drawer />

      <main className="flex-1" onClick={handleMainClick}>
        <Outlet />
        <PWAInstallBanner />
      </main>

      <Footer />
    </div>
  );
}
