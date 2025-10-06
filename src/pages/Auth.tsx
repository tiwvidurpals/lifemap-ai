import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AuthForm from '@/components/AuthForm';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useBruteForceProtection } from '@/hooks/use-brute-force-protection';

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
  const [resetSignal, setResetSignal] = useState(0);
  
  const {
    failedAttempts,
    isBlocked,
    isEmailVerificationRequired,
    remainingAttempts,
    remainingBlockTime,
    recordFailedAttempt,
    recordSuccessfulAttempt,
    clearAllProtection,
  } = useBruteForceProtection();

  // When user becomes logged out, signal the form to clear its fields
  useEffect(() => {
    if (!loading && !user) {
      setResetSignal((v) => v + 1);
    }
  }, [user, loading]);

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
      // Clear all protection on successful login
      clearAllProtection();
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
      
      // Record failed attempt for brute force protection
      recordFailedAttempt(email);
      
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

  const handleSignUp = async (
    email: string, 
    password: string, 
    metadata?: { fullName?: string; purpose?: string; age?: string }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(email, password, metadata);
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

  const handleSendVerificationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    if (error) {
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
    
    toast({
      title: "Verification email sent",
      description: "Please check your email and click the verification link.",
    });
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
        onSendVerificationEmail={handleSendVerificationEmail}
        isLoading={isLoading}
        mode={mode}
        onToggleMode={toggleMode}
        resetSignal={resetSignal}
        failedAttempts={failedAttempts}
        isBlocked={isBlocked}
        isEmailVerificationRequired={isEmailVerificationRequired}
        remainingAttempts={remainingAttempts}
        remainingBlockTime={remainingBlockTime}
      />
    </div>
  );
};

export default Auth;
