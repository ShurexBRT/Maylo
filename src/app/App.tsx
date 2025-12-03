import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";

import Layout from "./Layout";
import StartupGate from "./StartupGate";

// Public / auth
import WelcomePage from "@/features/welcome/WelcomePage";
import LoginPage from "@/features/auth/LoginPage";
import SignupPage from "@/features/auth/SignupPage";
import AuthCallbackPage from "@/features/auth/AuthCallbackPage";

// Main features
import HomePage from "@/features/search/HomePage";
import ResultsPage from "@/features/results/ResultsPage";
import ProfilePage from "@/features/profile/ProfilePage";
import SavedPage from "@/features/saved/SavedPage";
import AccountPage from "@/features/account/AccountPage";
import SettingsPage from "@/features/settings/SettingsPage";
import WriteReviewPage from "@/features/reviews/WriteReviewPage";

// Provider flow
import OnboardPage from "@/features/providers/OnboardPage";
import EditBusinessPage from "@/features/providers/EditBusinessPage";

// FAQ / errors
import FAQPage from "@/features/faq/FAQPage";
import NotFound from "@/features/errors/NotFound";


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* global guard za guest/auth */}
      <StartupGate />

      <Suspense fallback={<div className="p-4 text-center">Loading…</div>}>
        <Routes>
          {/* Public (no layout) */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Protected + glavne strane sa layout-om */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reviews/write/:id" element={<WriteReviewPage />} />

            {/* Provider rute */}
            <Route path="/providers/onboard" element={<OnboardPage />} />
            <Route path="/providers/edit" element={<EditBusinessPage />} />
            <Route path="/providers/edit/:id" element={<EditBusinessPage />} />

            {/* FAQ i ostalo */}
            <Route path="/faq" element={<FAQPage />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </QueryClientProvider>
  );
}
