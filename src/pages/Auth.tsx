import { useState } from 'react';
import { Navigate } from 'react-router-dom';
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
  const { user, loading, signIn, signInWithProvider } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  if (user && !loading) {
    return <Navigate to="/" />;
  }

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
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <AuthForm 
        onLogin={handleSignIn} 
        onSocialLogin={handleSocialLogin}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Auth;
