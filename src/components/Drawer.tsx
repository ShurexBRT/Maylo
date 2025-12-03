// src/components/Drawer.tsx
import { Link } from "react-router-dom";
import { useUI } from "@/lib/store";

export default function Drawer() {
  const { drawerOpen, setDrawer } = useUI();

  if (!drawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex"
      aria-hidden={!drawerOpen}
      onClick={() => setDrawer(false)} // klik na overlay = close
    >
      {/* overlay */}
      <div className="flex-1 bg-black/40" />

      {/* panel */}
      <aside
        className="w-72 max-w-full bg-white shadow-xl p-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()} // da klik unutra ne zatvara
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            className="text-slate-500 hover:text-slate-800"
            onClick={() => setDrawer(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            to="/"
            className="text-slate-800 hover:text-blue-600"
            onClick={() => setDrawer(false)}
          >
            Home
          </Link>
          <Link
            to="/saved"
            className="text-slate-800 hover:text-blue-600"
            onClick={() => setDrawer(false)}
          >
            Saved services
          </Link>
          <Link
            to="/account"
            className="text-slate-800 hover:text-blue-600"
            onClick={() => setDrawer(false)}
          >
            My account
          </Link>
          <Link
            to="/settings"
            className="text-slate-800 hover:text-blue-600"
            onClick={() => setDrawer(false)}
          >
            Settings
          </Link>
        </nav>
      </aside>
    </div>
  );
}
