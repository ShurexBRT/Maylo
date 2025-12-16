import { Link, useLocation } from "react-router-dom";
import { useUI } from "@/lib/store";

export default function Drawer() {
  const { drawerOpen, setDrawer } = useUI();
  const { pathname } = useLocation();

  if (!drawerOpen) return null;

  const close = () => setDrawer(false);

  return (
    <div
      className="fixed inset-0 z-[80]"
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* panel */}
      <aside
        className="absolute right-0 top-0 h-full w-[86%] max-w-xs bg-white shadow-2xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-slate-900">Menu</div>
          <button
            className="rounded-lg border px-3 py-1 hover:bg-slate-50"
            onClick={close}
          >
            Close
          </button>
        </div>

        <nav className="grid gap-2">
          <Link
            to="/"
            onClick={close}
            className={`rounded-lg px-3 py-2 hover:bg-slate-50 ${pathname === "/" ? "bg-slate-50" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/saved"
            onClick={close}
            className={`rounded-lg px-3 py-2 hover:bg-slate-50 ${pathname === "/saved" ? "bg-slate-50" : ""}`}
          >
            Saved
          </Link>
          <Link
            to="/account"
            onClick={close}
            className={`rounded-lg px-3 py-2 hover:bg-slate-50 ${pathname === "/account" ? "bg-slate-50" : ""}`}
          >
            Account & Settings
          </Link>
        </nav>
      </aside>
    </div>
  );
}
