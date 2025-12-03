// src/components/Header.tsx
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useUI } from "@/lib/store";
import mayloLogo from "@/assets/maylo/maylo-logo.png";

export default function Header() {
  const { toggleDrawer } = useUI();

  return (
    <header className="app-header">
      <div className="header-inner flex items-center justify-between px-4 py-3">
        {/* left: logo + brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={mayloLogo} alt="Maylo" className="h-8 w-8 rounded-xl" />
          <span className="text-lg font-semibold tracking-tight">Maylo</span>
        </Link>

        {/* right: hamburger */}
        <button
          type="button"
          aria-label="Open navigation menu"
          className="btn-icon inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation(); // <— DA NE ZATVARA ODMAH DRAWER
            toggleDrawer();
          }}
        >
          <Menu className="h-6 w-6 text-slate-800" />
        </button>
      </div>
    </header>
  );
}
