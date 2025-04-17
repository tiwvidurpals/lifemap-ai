
import { createClient } from '@supabase/supabase-js';

// When using Vite with the Lovable Supabase integration, these variables are injected at build time
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for Supabase environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please connect your Lovable project to Supabase using the Supabase integration in the Lovable interface.');
}

// Initialize a mock Supabase client for development if no credentials are available
export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',  // Changed from placeholder-url
  supabaseAnonKey || 'example-key'  // Changed from placeholder-key
);

// Mock authentication functions to prevent errors when Supabase is not connected
export const mockAuthResponse = {
  data: { user: { id: 'mock-user-id', email: 'example@user.com', user_metadata: { full_name: 'Demo User', age: 30 } } },
  error: null
};

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
    // If Supabase is not properly configured, return a mock user for development
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Using mock user data since Supabase is not configured');
      return {
        id: 'mock-user-id',
        email: 'example@user.com',
        metadata: { full_name: 'Demo User', age: 30 }
      };
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata as UserMetadata
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    
    // If there's an error with Supabase connection, provide a mock user for development
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        id: 'mock-user-id',
        email: 'example@user.com',
        metadata: { full_name: 'Demo User', age: 30 }
      };
    }
    
    return null;
  }
}
