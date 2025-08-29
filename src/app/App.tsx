import { useEffect, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import '@/styles/globals.css'

import Layout from './Layout'

// Stranice (stubovi / tvoje postojeće)
import HomePage from '@/features/search/HomePage'
import ResultsPage from '@/features/results/ResultsPage'
import ProfilePage from '@/features/profile/ProfilePage'
import SavedPage from '@/features/saved/SavedPage'
import AccountPage from '@/features/account/AccountPage'
import SettingsPage from '@/features/settings/SettingsPage'
import WriteReviewPage from '@/features/reviews/WriteReviewPage'
import ProviderOnboardPage from '@/features/providers/OnboardPage'
import WelcomePage from '@/features/welcome/WelcomePage'
import AuthCallbackPage from '@/features/auth/AuthCallbackPage'
import LoginPage from '@/features/auth/LoginPage'
import SignupPage from '@/features/auth/SignupPage'

import { attachGuestAutoLogout } from '@/lib/guest'
import StartupGate from './StartupGate' 

const NotFound = () => <main className="max-w-5xl mx-auto p-6">404 – Page not found</main>

export default function App() {
  // Auto-logout za guest session (sessionStorage + TTL fallback)
  useEffect(() => {
    const detach = attachGuestAutoLogout()
    return detach
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="p-4">Loading…</div>}>
          {/* StartupGate: odlučuje /welcome vs / (po session/guest stanju) */}
          <StartupGate>
            <Routes>
              {/* Public layout sa headerom/drawerom/footerom */}
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/write-review/:id" element={<WriteReviewPage />} />
                <Route path="/provider/onboard" element={<ProviderOnboardPage />} />
              </Route>

              {/* Auth rute izvan glavnog layouta */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* Welcome ekranska ruta */}
              <Route path="/welcome" element={<WelcomePage />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
              
            </Routes>
          </StartupGate>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
