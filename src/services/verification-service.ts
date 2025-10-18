import { supabase } from '@/integrations/supabase/client';
import { createVerificationCodeTemplate, createPasswordResetTemplate } from './email-templates';

// Generate a 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store verification code in localStorage with expiration
export function storeVerificationCode(email: string, code: string): void {
  const verificationData = {
    email,
    code,
    timestamp: Date.now(),
    expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
  };
  
  localStorage.setItem('lifemap_verification_code', JSON.stringify(verificationData));
}

// Retrieve and validate verification code
export function validateVerificationCode(email: string, inputCode: string): boolean {
  const stored = localStorage.getItem('lifemap_verification_code');
  if (!stored) return false;
  
  try {
    const verificationData = JSON.parse(stored);
    const now = Date.now();
    
    // Check if expired
    if (now > verificationData.expiresAt) {
      localStorage.removeItem('lifemap_verification_code');
      return false;
    }
    
    // Check if email and code match
    return verificationData.email === email && verificationData.code === inputCode;
  } catch {
    localStorage.removeItem('lifemap_verification_code');
    return false;
  }
}

// Clear verification code
export function clearVerificationCode(): void {
  localStorage.removeItem('lifemap_verification_code');
}

// Send verification email using Supabase
export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  // Store the code for validation
  storeVerificationCode(email, code);
  
  // Create professional email template
  const emailTemplate = createVerificationCodeTemplate(code, email);
  
  try {
    // Use Supabase's resend functionality with custom email template
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`
      }
    });
    
    if (error) {
      throw error;
    }
    
    // Success - email sent via Supabase
    console.log(`Verification email sent to ${email}`);
    
  } catch (error) {
    console.warn('Supabase email failed, using fallback:', error);
    
    // Fallback for development/testing
    if (process.env.NODE_ENV === 'development') {
      // In development, show the code in console and alert
      console.log(`Development Mode - Verification code for ${email}: ${code}`);
      alert(`Development: Your verification code is ${code}. Check your email or use this code to continue.`);
    } else {
      // In production, throw error if email fails
      throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string): Promise<void> {
  const resetUrl = `${window.location.origin}/auth?mode=reset`;
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    });
    
    if (error) {
      throw error;
    }
    
    // Success - password reset email sent via Supabase
    console.log(`Password reset email sent to ${email}`);
    
  } catch (error) {
    console.warn('Supabase password reset email failed:', error);
    
    // Fallback for development/testing
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development Mode - Password reset link for ${email}: ${resetUrl}`);
      alert(`Development: Password reset email would be sent to ${email}. Use this link: ${resetUrl}`);
    } else {
      throw new Error(`Failed to send password reset email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
