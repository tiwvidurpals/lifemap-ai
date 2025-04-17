
import { createClient } from '@supabase/supabase-js';

// When using Vite with the Lovable Supabase integration, these variables are injected at build time
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verify that we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your Supabase connection in the Lovable interface.');
  // Provide fallback values to prevent the app from crashing during development
  // In production with the Lovable Supabase integration, these values will be replaced
}

// Create a single supabase client for the entire app
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',  // Fallback value
  supabaseAnonKey || 'placeholder-key'  // Fallback value
);

export type UserMetadata = {
  full_name?: string;
  age?: number;
};

export type AuthUser = {
  id: string;
  email?: string;
  metadata?: UserMetadata;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata as UserMetadata
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
