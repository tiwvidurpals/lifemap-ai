
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, AuthUser, getCurrentUser, UserMetadata } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signInWithProvider: (provider: "google" | "facebook" | "github") => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // If Supabase is not configured, set mock user data for development
        if (!isSupabaseConfigured()) {
          console.warn('Using mock auth data since Supabase is not configured');
          const mockUser = {
            id: 'mock-user-id',
            email: 'example@user.com',
            metadata: { full_name: 'Demo User', age: 30 }
          };
          setUser(mockUser);
          setLoading(false);
          return;
        }

        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Only set up auth state changes if Supabase is configured
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      });

      return () => {
        data.subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured()) {
        // Mock successful sign-in for development
        console.warn('Using mock sign-in since Supabase is not configured');
        setUser({
          id: 'mock-user-id',
          email: email,
          metadata: { full_name: 'Demo User', age: 30 }
        });
        toast({
          title: "Development Mode",
          description: "Signed in with mock data. Connect to Supabase for actual authentication.",
        });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      if (!isSupabaseConfigured()) {
        // Mock successful sign-up for development
        console.warn('Using mock sign-up since Supabase is not configured');
        setUser({
          id: 'mock-user-id',
          email: email,
          metadata: metadata as UserMetadata
        });
        toast({
          title: "Development Mode",
          description: "Account created with mock data. Connect to Supabase for actual authentication.",
        });
        return;
      }

      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata
        }
      });
      if (error) throw error;
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithProvider = async (provider: "google" | "facebook" | "github") => {
    try {
      if (!isSupabaseConfigured()) {
        // Mock successful social sign-in for development
        console.warn(`Using mock ${provider} sign-in since Supabase is not configured`);
        setUser({
          id: 'mock-user-id',
          email: `${provider}-user@example.com`,
          metadata: { full_name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`, age: 30 }
        });
        toast({
          title: "Development Mode",
          description: `Signed in with mock ${provider} data. Connect to Supabase for actual authentication.`,
        });
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: `${provider} sign in failed`,
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (!isSupabaseConfigured()) {
        // Mock sign-out for development
        console.warn('Using mock sign-out since Supabase is not configured');
        setUser(null);
        toast({
          title: "Development Mode",
          description: "Signed out with mock data. Connect to Supabase for actual authentication.",
        });
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithProvider, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
