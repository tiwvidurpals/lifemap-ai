
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AuthForm from '@/components/AuthForm';
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const { user, loading, signIn, signInWithProvider } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (user && !loading) {
    return <Navigate to="/" />;
  }

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "github" | "apple" | "linkedin_oidc") => {
    setIsLoading(true);
    try {
      await signInWithProvider(provider);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to sign in with ${provider}: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <AuthForm 
        onLogin={handleSignIn} 
        onSocialLogin={handleSocialLogin}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Auth;
