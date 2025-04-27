
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
  const { user, loading, signIn, signInWithProvider } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (user && !loading) {
    return <Navigate to="/" />;
  }

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "github") => {
    setIsLoading(true);
    try {
      await signInWithProvider(provider);
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <AuthForm 
        onLogin={handleSignIn} 
        onSocialLogin={handleSocialLogin}
      />
    </div>
  );
};

export default Auth;
