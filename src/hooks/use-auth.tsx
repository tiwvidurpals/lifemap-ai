import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<void>;
  signInWithProvider: (provider: "google" | "facebook" | "github" | "apple" | "linkedin_oidc") => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Auth] onAuthStateChange:', event, session);
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[Auth] getSession:', session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    toast({
      title: "Welcome!",
      description: "Please check your email to verify your account.",
    });
  };

  const signInWithProvider = async (provider: "google" | "facebook" | "github" | "apple" | "linkedin_oidc") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Use root URL to avoid missing callback route issues in SPA
        redirectTo: `${window.location.origin}`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      console.log('[Auth] Starting sign out...');
      console.log('[Auth] Current user before sign out:', user);
      
      const { error } = await supabase.auth.signOut();
      console.log('[Auth] Sign out response:', { error });
      
      if (error) {
        console.error('[Auth] Sign out error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        // If Supabase sign out fails, try to clear local state anyway
        console.log('[Auth] Attempting to clear local auth state due to Supabase error');
        setUser(null);
        toast({
          title: "Signed out locally",
          description: "You have been signed out locally. Please refresh the page.",
        });
        return;
      }
      
      console.log('[Auth] Sign out successful');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('[Auth] Sign out failed with full error:', error);
      console.error('[Auth] Error type:', typeof error);
      console.error('[Auth] Error constructor:', error?.constructor?.name);
      
      // Fallback: clear local state even if Supabase fails
      console.log('[Auth] Fallback: clearing local auth state');
      setUser(null);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Signed out locally",
        description: `Supabase sign out failed, but you have been signed out locally. Error: ${errorMessage}`,
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
