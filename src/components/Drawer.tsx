// src/components/Drawer.tsx
import { Link, useLocation } from "react-router-dom";
import { useUI } from "@/lib/store";
import { useSession, useProfile, useCanAddBusiness } from "@/lib/authState";
import { signOutTo } from "@/lib/auth";

export default function Drawer() {
  const { drawerOpen, closeDrawer } = useUI();
  const location = useLocation();

  const { userId } = useSession();
  const { profile } = useProfile(userId);
  const canAddBusiness = useCanAddBusiness(userId, profile?.role);

  const isActive = (path: string) => location.pathname === path;
  const handleClose = () => closeDrawer();

  return (
    <aside
      aria-hidden={!drawerOpen}
      className={`fixed top-0 right-0 z-[1000] h-screen w-72 bg-white shadow-2xl transition-transform duration-300 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* overlay – klik van menija zatvara ga */}
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute left-[-9999px] top-0 h-0 w-0"
        onClick={handleClose}
      />

      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
        <span className="text-sm font-semibold">Menu</span>
        <button
          type="button"
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close navigation"
        >
          ✕
        </button>
      </div>

      <nav className="p-4 text-sm">
        <ul className="space-y-1">
          {/* MAIN NAV */}
      

          {userId && (
            <li>
              <Link
                to="/saved"
                onClick={handleClose}
                className={`block rounded-md px-4 py-2 ${
                  isActive("/saved")
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50"
                }`}
              >
                Saved
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/account"
              onClick={handleClose}
              className={`block rounded-md px-4 py-2 ${
                isActive("/account")
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }`}
            >
              Account &amp; Settings
            </Link>
          </li>

          {/* PROVIDER BLOK */}
          {userId &&
            (profile?.role === "provider" || profile?.role === "admin") && (
              <li className="mt-4 border-t border-slate-100 pt-4">
                <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Service provider
                </p>

                {canAddBusiness ? (
                  <Link
                    to="/provider/onboard"
                    onClick={handleClose}
                    className="block px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    Add your business
                  </Link>
                ) : (
                  <Link
                    to="/provider/edit"
                    onClick={handleClose}
                    className="block px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    Edit your business
                  </Link>
                )}
              </li>
            )}

          {/* AUTH BLOK */}
          {!userId && (
            <li className="mt-4 border-t border-slate-100 pt-4">
              <Link
                to="/login"
                onClick={handleClose}
                className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
              >
                Log in / Sign up
              </Link>
            </li>
          )}

          {userId && (
            <li className="mt-2">
              <button
                type="button"
                onClick={async () => {
                  handleClose();
                  await signOutTo("/welcome");
                }}
                className="w-full rounded-md px-4 py-2 text-left text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
