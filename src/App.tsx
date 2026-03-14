import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import LikedList from "./pages/LikedList";
import Matches from "./pages/Matches";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import BottomNav from "./components/BottomNav";
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
  const hideNav = ["/", "/auth", "/onboarding", "/reset-password", "/subscribe"].includes(location.pathname);

  if (loading) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={user ? (profile?.onboarding_completed ? <Navigate to="/browse" replace /> : <Navigate to="/onboarding" replace />) : <Index />} />
        <Route path="/auth" element={user ? <Navigate to="/browse" replace /> : <Auth />} />
        <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/auth" replace />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/liked" element={<ProtectedRoute><LikedList /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
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
