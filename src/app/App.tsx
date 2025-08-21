import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import '@/styles/globals.css'

// Layout
import Layout from './Layout'

// Pages (stubs / postojeće)
import HomePage from '@/features/search/HomePage'
import ResultsPage from '@/features/results/ResultsPage'
import ProfilePage from '@/features/profile/ProfilePage'
import SavedPage from '@/features/saved/SavedPage'

// Optional (stubs – možeš dodati kasnije prave)
const NotFound = () => <main className="max-w-5xl mx-auto p-6">404 – Page not found</main>
const LoginPage = () => <main className="max-w-md mx-auto p-6">Login (stub)</main>
const SignupPage = () => <main className="max-w-md mx-auto p-6">Sign up (stub)</main>
const AccountPage = () => <main className="max-w-3xl mx-auto p-6">My Account (stub)</main>
const SettingsPage = () => <main className="max-w-3xl mx-auto p-6">Settings (stub)</main>
const WriteReviewPage = () => <main className="max-w-3xl mx-auto p-6">Write Review (stub)</main>
const ProviderOnboard = () => <main className="max-w-3xl mx-auto p-6">Provider Onboarding (stub)</main>

export default function App(){
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
              <Route path="/account" element={<AccountPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/write-review/:id" element={<WriteReviewPage />} />
              <Route path="/provider/onboard" element={<ProviderOnboard />} />
            </Route>

            {/* Auth rute bez glavnog layouta (po želji ih možeš staviti i u Layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
