import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import '@/styles/globals.css'

// Layout
import Layout from './Layout'

// Public pages
import HomePage from '@/features/search/HomePage'
import ResultsPage from '@/features/results/ResultsPage'
import ProfilePage from '@/features/profile/ProfilePage'
import SavedPage from '@/features/saved/SavedPage'

// Auth pages (prave, ne stubovi)
import LoginPage from '@/features/auth/LoginPage'
import SignupPage from '@/features/auth/SignupPage'
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/ResetPasswordPage'

// Optional provider onboarding (možemo kasnije)
const ProviderOnboard = () => <main className="max-w-3xl mx-auto p-6">Provider Onboarding (stub)</main>

// Minimalna 404
const NotFound = () => <main className="max-w-5xl mx-auto p-6">404 – Page not found</main>

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="p-4">Loading…</div>}>
          <Routes>
            {/* Public layout sa headerom/drawerom/footerom */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/write-review/:id" element={<Protected><WriteReviewFallback /></Protected>} />
              <Route path="/provider/onboard" element={<Protected role="provider"><ProviderOnboard /></Protected>} />
            </Route>

            {/* Auth bez layouta (po želji može i u Layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* OAuth callback – može samo redirect na / ili /account */}
            <Route path="/auth/callback" element={<LoginPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

/** Fallback za /write-review/:id dok ne ubacimo pravu WriteReviewPage */
function WriteReviewFallback() {
  return <main className="max-w-3xl mx-auto p-6">Write Review</main>
}
import Protected from '@/components/Protected'

