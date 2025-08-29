import { Link, useNavigate } from 'react-router-dom'
import welcomeImg from '@/assets/illustrations/welcome.png' // <-- import asseta
import { markGuestSession } from '@/app/StartupGate'
import { clearGuestSession } from '@/app/StartupGate'

export default function WelcomePage() {
  const nav = useNavigate()

  const onGuest = () => {
    // evidentiramo “guest” pa pustamo korisnika u app
    markGuestSession()
    nav('/', { replace: true })
  }

  // ako se iz nekog razloga došlo na welcome nakon logout-a,
  // obriši potencijalne stare flagove
  clearGuestSession()

  return (
    <main className="max-w-md mx-auto px-4 py-10 text-center">
      <img
        src={welcomeImg}
        alt="Maylo welcomes you"
        className="w-56 mx-auto mb-6"
        loading="eager"
      />

      <h1 className="text-2xl font-bold mb-2">Welcome to Maylo</h1>
      <p className="text-gray-600 mb-8">
        Find local services in the language you understand.
      </p>

      <div className="flex flex-col gap-3">
        <Link to="/login" className="btn-primary">Log in</Link>
        <Link to="/signup" className="btn-secondary">Sign up</Link>
        <button onClick={onGuest} className="btn-ghost">Continue as guest</button>
      </div>
    </main>
  )
}
