// src/components/Drawer.tsx
import { Link } from "react-router-dom";
import { useUI } from "@/lib/store";
import { useSession, useProfile, useCanAddBusiness } from "@/lib/authState";
import { signOutTo } from "@/lib/auth";

export default function Drawer() {
  const { drawerOpen, closeDrawer } = useUI();
  const { userId } = useSession();
  const { profile } = useProfile(userId);
  const canAddBusiness = useCanAddBusiness(userId, profile?.role);

  const handleClose = () => closeDrawer();

  return (
    <aside
      className={`fixed top-0 right-0 z-[1000] h-screen w-72 bg-white shadow-2xl transform transition-transform duration-300 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!drawerOpen}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-xl font-semibold">Maylo</span>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleClose}
          aria-label="Close menu"
        >
          ×
        </button>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          <li>
            <Link
              to="/saved"
              onClick={handleClose}
              className="block rounded-md px-4 py-3 hover:bg-gray-50"
            >
              Saved
            </Link>
          </li>

          {userId && (
            <li>
              <Link
                to="/account"
                onClick={handleClose}
                className="block rounded-md px-4 py-3 hover:bg-gray-50"
              >
                My Account
              </Link>
            </li>
          )}

          {userId && (
            <li>
              <Link
                to="/settings"
                onClick={handleClose}
                className="block rounded-md px-4 py-3 hover:bg-gray-50"
              >
                Settings
              </Link>
            </li>
          )}

          {/* Provider UX */}
          {userId && (profile?.role === "provider" || profile?.role === "admin") && (
            <li>
              {canAddBusiness ? (
                <Link
                  to="/provider/onboard"
                  onClick={handleClose}
                  className="block rounded-md px-4 py-3 hover:bg-gray-50"
                >
                  Add your business
                </Link>
              ) : (
                <Link
                  to="/provider/edit"
                  onClick={handleClose}
                  className="block rounded-md px-4 py-3 hover:bg-gray-50"
                >
                  Edit your business
                </Link>
              )}
            </li>
          )}

          {/* Auth actions */}
          {!userId ? (
            <>
              <li>
                <Link
                  to="/login"
                  onClick={handleClose}
                  className="block rounded-md px-4 py-3 hover:bg-gray-50"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  onClick={handleClose}
                  className="block rounded-md px-4 py-3 hover:bg-gray-50"
                >
                  Sign up
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={async () => {
                  handleClose();
                  await signOutTo("/welcome");
                }}
                className="w-full rounded-md px-4 py-3 text-left text-red-600 hover:bg-gray-50"
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
