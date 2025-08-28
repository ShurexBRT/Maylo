import { Link } from 'react-router-dom'
import welcomeImg from '@/assets/illustrations/welcome.png'

export default function WelcomePage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      {/* Illustration */}
      <img
        src={welcomeImg}
        alt="Maylo welcomes you"
        className="mx-auto w-64 h-auto mb-6"
        loading="eager"
      />

      {/* Title & copy */}
      <h1 className="text-2xl font-bold text-slate-900 text-center">
        Welcome to Maylo
      </h1>
      <p className="mt-2 text-slate-600 text-center">
        Find local services in a language you understand. Sign in or create an
        account to save favorites and leave reviews.
      </p>

      {/* CTA buttons */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/login"
          className="btn-primary inline-flex items-center justify-center"
        >
          Log in
        </Link>
        <Link
          to="/signup"
          className="btn-secondary inline-flex items-center justify-center"
        >
          Sign up
        </Link>
      </div>
    </main>
  )
}
