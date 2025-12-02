// src/app/App.tsx
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import "@/styles/globals.css";

// Layout
import Layout from "./Layout";

// Pages
import HomePage from "@/features/search/HomePage";
import ResultsPage from "@/features/results/ResultsPage";
import ProfilePage from "@/features/profile/ProfilePage";
import SavedPage from "@/features/saved/SavedPage";
import AccountPage from "@/features/account/AccountPage";
import SettingsPage from "@/features/settings/SettingsPage";
import WriteReviewPage from "@/features/reviews/WriteReviewPage";

import WelcomePage from "@/features/auth/WelcomePage";
import LoginPage from "@/features/auth/LoginPage";
import SignupPage from "@/features/auth/SignupPage";
import AuthCallbackPage from "@/features/auth/AuthCallbackPage";
import NotFound from "@/features/errors/NotFound";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>

          <Routes>

            {/* Public (no layout) */}
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected or main pages with layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/reviews/write/:id" element={<WriteReviewPage />} />


              <Route path="/provider/onboard" element={<OnboardPage />} />
              <Route path="/provider/edit" element={<EditBusinessPage />} />
              <Route path="/provider/edit/:id" element={<EditBusinessPage />} />

              <Route path="/faq" element={<FAQPage />} />
              
            </Route>

            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
