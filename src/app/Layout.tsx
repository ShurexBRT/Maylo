import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Drawer from "@/components/Drawer";
import Footer from "@/components/Footer";
import { useUI } from "@/lib/store";

export default function Layout() {
  const { drawerOpen, setDrawer } = useUI();

  return (
    <div
      className="min-h-screen"
      onClick={() => {
        // klik po “pozadini” zatvara drawer
        if (drawerOpen) setDrawer(false);
      }}
    >
      <Header />
      <Drawer />

      <main onClick={(e) => e.stopPropagation()}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
