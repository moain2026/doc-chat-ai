/**
 * App.tsx
 * Root router with lazy-loaded pages, AnimatePresence page transitions,
 * and global ErrorBoundary wrapping everything.
 */
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { Spinner } from "@/components/ui/Spinner";

// Lazy-loaded pages (code-split per route)
const LoginPage     = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const SignupPage    = lazy(() => import("@/pages/SignupPage").then((m) => ({ default: m.SignupPage })));
const DashboardPage = lazy(() => import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const DocumentsPage = lazy(() => import("@/pages/DocumentsPage").then((m) => ({ default: m.DocumentsPage })));
const ChatPage      = lazy(() => import("@/pages/ChatPage").then((m) => ({ default: m.ChatPage })));
const NotFoundPage  = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Full-page spinner for Suspense fallback */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Spinner size="lg" />
  </div>
);

/** Inner component so we can use useLocation inside BrowserRouter */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:conversationId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
        <ToastProvider />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
