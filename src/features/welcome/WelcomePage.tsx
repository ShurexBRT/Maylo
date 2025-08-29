import { Link, useNavigate } from 'react-router-dom'
import { enableGuest } from '@/lib/guest'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <main className="max-w-md mx-auto px-4 py-10 text-center">
      {/* Illustration (stavi svoju putanju/asset po želji) */}
      <img
        src="/illustrations/welcome.png"
        alt="Welcome to Maylo"
        className="mx-auto w-56 h-auto mb-6"
        loading="eager"
      />

      <h1 className="text-2xl font-bold text-slate-900">Welcome to Maylo</h1>
      <p className="mt-2 text-slate-600">
        Find local services in a language you understand.
      </p>

      <div className="mt-8 space-y-3">
        <Link to="/login" className="btn-primary w-full inline-flex justify-center">
          Log in
        </Link>
        <Link to="/signup" className="btn-secondary w-full inline-flex justify-center">
          Sign up
        </Link>
        <button
          className="btn-ghost w-full"
          onClick={() => {
            enableGuest()
            navigate('/', { replace: true })
          }}
        >
          Continue as guest
        </button>
      </div>

      {/* (optional) Footer links */}
      <div className="mt-8 text-sm text-slate-500 space-x-4">
        <Link to="/faq" className="hover:underline">FAQ</Link>
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/contact" className="hover:underline">Contact</Link>
      </div>
    </main>
  )
}
