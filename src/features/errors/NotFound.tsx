import { Link } from "react-router-dom";
import "@/styles/globals.css";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">404</div>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-slate-600 mb-6">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Back to home
      </Link>
    </main>
  );
}
