import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AuthForm from '@/components/AuthForm';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Define error type
interface AuthError {
  message: string;
  status?: number;
}

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Default to login unless signup is specified in URL
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const { user, loading, signIn, signUp, signInWithProvider } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  if (user && !loading) {
    return <Navigate to="/" />;
  }

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'signup' : 'login';
    setMode(newMode);
    // Update URL without refreshing page
    setSearchParams({ mode: newMode });
    // Clear any errors when switching modes
    setError(null);
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: unknown) {
      const authError = error as AuthError;
      let errorMessage = authError.message || "Failed to sign in";
      
      // Handle common auth errors
      if (errorMessage.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (errorMessage.includes("Email not confirmed")) {
        errorMessage = "Please check your email to verify your account before signing in.";
      }
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      // Switch to login mode after successful signup
      setMode('login');
      setSearchParams({ mode: 'login' });
    } catch (error: unknown) {
      const authError = error as AuthError;
      let errorMessage = authError.message || "Failed to create account";
      
      // Handle common signup errors
      if (errorMessage.includes("email already")) {
        errorMessage = "This email is already registered. Please try signing in instead.";
      } else if (errorMessage.includes("password")) {
        errorMessage = "Password must be at least 6 characters long.";
      }
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "github" | "apple" | "linkedin_oidc") => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithProvider(provider);
      // No need for success toast here as the page will redirect to provider
    } catch (error: unknown) {
      const authError = error as AuthError;
      let errorMessage = authError.message || `Failed to sign in with ${provider}`;
      
      // Handle specific error cases
      if (errorMessage.includes("provider is not enabled")) {
        errorMessage = `The ${provider} login option is not currently enabled. Please use email/password login or contact the administrator.`;
      } else if (errorMessage.includes("popup_closed")) {
        errorMessage = "You closed the authentication window. Please try again.";
      } else if (errorMessage.includes("redirect_uri_mismatch")) {
        errorMessage = "Authentication configuration error. Please contact the administrator.";
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      {error && (
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{mode === 'login' ? 'Authentication Error' : 'Registration Error'}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <AuthForm 
        onLogin={handleSignIn}
        onSignUp={handleSignUp}
        onSocialLogin={handleSocialLogin}
        isLoading={isLoading}
        mode={mode}
        onToggleMode={toggleMode}
      />
    </div>
  );
};

export default Auth;
