
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { useMobileOptimizations } from "@/hooks/use-mobile-optimizations";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Auth callback component to handle redirects from OAuth providers
const AuthCallback = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Processing login...</div>;
  }
  
  return <Navigate to="/" />;
};

// Simple redirect to signup mode
const SignUpRedirect = () => {
  return <Navigate to="/auth?mode=signup" />;
};

// Mobile optimization wrapper
const MobileOptimizedApp = ({ children }: { children: React.ReactNode }) => {
  useMobileOptimizations();
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <MobileOptimizedApp>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/signup" element={<SignUpRedirect />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </MobileOptimizedApp>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
