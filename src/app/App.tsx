import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/app/Layout";
import StartupGate from "@/app/StartupGate";

// pages
import HomePage from "@/features/search/HomePage";
import ResultsPage from "@/features/results/ResultsPage";
import ProfilePage from "@/features/profile/ProfilePage";
import SavedPage from "@/features/saved/SavedPage";

import LoginPage from "@/features/auth/LoginPage";
import SignupPage from "@/features/auth/SignupPage";
import WelcomePage from "@/features/welcome/WelcomePage";
import AuthCallbackPage from "@/features/auth/AuthCallbackPage";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";
import SetPasswordPage from "@/features/auth/SetPasswordPage";

import WriteReviewPage from "@/features/reviews/WriteReviewPage";

import AccountPage from "@/features/account/AccountPage";
import OnboardPage from "@/features/providers/OnboardPage";
import EditBusinessPage from "@/features/providers/EditBusinessPage";

import NotFound from "@/features/errors/NotFound";

export default function App() {
  return (
      

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/saved" element={<SavedPage />} />

          {/* auth */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />

          {/* reviews */}
          <Route path="/write-review/:id" element={<WriteReviewPage />} />

          {/* account */}
          <Route path="/account" element={<AccountPage />} />

          {/* provider */}
          <Route path="/provider/onboard" element={<OnboardPage />} />
          <Route path="/provider/edit/:id" element={<EditBusinessPage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
  );
}
