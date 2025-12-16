// src/app/App.tsx
import { Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import StartupGate from "./StartupGate";

// pages (prilagodi import putanje kako su kod tebe)
import WelcomePage from "@/features/welcome/WelcomePage";
import HomePage from "@/features/search/HomePage";
import ResultsPage from "@/features/results/ResultsPage";
import ProfilePage from "@/features/profile/ProfilePage";
import SavedPage from "@/features/saved/SavedPage";
import SettingsPage from "@/features/settings/SettingsPage";
import AccountPage from "@/features/account/AccountPage";

import LoginPage from "@/features/auth/LoginPage";
import SignupPage from "@/features/auth/SignupPage";
import AuthCallbackPage from "@/features/auth/AuthCallbackPage";
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";
import SetPasswordPage from "@/features/auth/SetPasswordPage";

import WriteReviewPage from "@/features/reviews/WriteReviewPage";
import FAQPage from "@/features/faq/FAQPage";

import OnboardPage from "@/features/providers/OnboardPage";
import EditBusinessPage from "@/features/providers/EditBusinessPage";

import NotFound from "@/features/errors/NotFound";

export default function App() {
  return (
    <StartupGate>
      <Routes>
        {/* sve što treba header/drawer/footer ide kroz Layout */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* public */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/reviews/write/:id" element={<WriteReviewPage />} />

          {/* auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} /> 
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />

          {/* account */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* provider */}
          <Route path="/provider/onboard" element={<OnboardPage />} />
          <Route path="/provider/edit" element={<EditBusinessPage />} />
          <Route path="/provider/edit/:id" element={<EditBusinessPage />} />

          {/* fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </StartupGate>
  );
}
