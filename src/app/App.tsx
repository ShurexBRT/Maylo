// src/App.tsx
import { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import '@/styles/globals.css'

import Layout from './Layout'

// Stranice
import HomePage from '@/features/search/HomePage'
import ResultsPage from '@/features/results/ResultsPage'
import ProfilePage from '@/features/profile/ProfilePage'
import SavedPage from '@/features/saved/SavedPage'
import AccountPage from '@/features/account/AccountPage'
import SettingsPage from '@/features/settings/SettingsPage'
import LoginPage from '@/features/auth/LoginPage'
import SignupPage from '@/features/auth/SignupPage'
import AuthCallbackPage from '@/features/auth/AuthCallbackPage'
import SetPasswordPage from '@/features/auth/SetPasswordPage'

const NotFound = () => <main className="max-w-5xl mx-auto p-6">404 – Page not found</main>

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="p-4">Loading…</div>}>
          <Routes>
            {/* layout sa headerom/drawerom/footerom */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/set-password" element={<SetPasswordPage />} />
            </Route>

            {/* auth rute bez glavnog layouta po želji */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
