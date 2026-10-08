import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import LikedList from "./pages/LikedList";
import Matches from "./pages/Matches";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Subscription from "./pages/Subscription";
import BottomNav from "./components/BottomNav";
import NetworkStatus from "./components/NetworkStatus";
import NativeSplash from "./components/NativeSplash";
import Seo from "@/components/Seo";
import MaoriBoyNames from "./pages/MaoriBoyNames";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, profile } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (profile && !profile.onboarding_completed) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
};

const AppLayout = () => {
  const location = useLocation();
  const { user, loading, profile } = useAuth();
  const hideNav = ["/", "/auth", "/onboarding", "/reset-password", "/subscribe", "/privacy", "/terms", "/maori-boy-names"].includes(location.pathname);

  if (loading) return null;

  return (
    <>
      <NativeSplash />
      <NetworkStatus />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={user ? (profile?.onboarding_completed ? <Navigate to="/browse" replace /> : <Navigate to="/onboarding" replace />) : <PageTransition><Index /></PageTransition>} />
          <Route path="/maori-boy-names" element={<PageTransition><MaoriBoyNames /></PageTransition>} />
          <Route path="/auth" element={user ? <Navigate to="/browse" replace /> : <PageTransition><Seo title="Sign In — Ingoa" description="Sign in or create your Ingoa account to start discovering meaningful Pacific baby names." path="/auth" /><Auth /></PageTransition>} />
          <Route path="/onboarding" element={user ? <PageTransition><Onboarding /></PageTransition> : <Navigate to="/auth" replace />} />
          <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
          <Route path="/browse" element={<ProtectedRoute><PageTransition><Browse /></PageTransition></ProtectedRoute>} />
          <Route path="/liked" element={<ProtectedRoute><PageTransition><LikedList /></PageTransition></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><PageTransition><Matches /></PageTransition></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
          <Route path="/subscribe" element={<ProtectedRoute><PageTransition><Subscription /></PageTransition></ProtectedRoute>} />
          <Route path="/privacy" element={<PageTransition><Seo title="Privacy Policy — Ingoa" description="How Ingoa collects, uses and protects your personal information." path="/privacy" /><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Seo title="Terms of Service — Ingoa" description="The terms that govern your use of the Ingoa Pacific baby names app." path="/terms" /><Terms /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      {!hideNav && user && <BottomNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <AppLayout />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
