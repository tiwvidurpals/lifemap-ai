import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from '@/components/ui/use-toast';

interface UseInactivityLogoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  events?: string[];
}

export function useInactivityLogout({
  timeoutMinutes = 360, // 6 hours in minutes
  warningMinutes = 30, // Show warning 30 minutes before logout
  events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
}: UseInactivityLogoutOptions = {}) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set warning timer (30 minutes before logout)
    const warningTime = (timeoutMinutes - warningMinutes) * 60 * 1000;
    warningTimeoutRef.current = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      if (timeSinceLastActivity >= warningTime) {
        toast({
          title: "Session Expiring Soon",
          description: `You will be automatically logged out in ${warningMinutes} minutes due to inactivity. Please interact with the page to stay logged in.`,
          variant: "destructive",
          duration: 10000, // Show for 10 seconds
        });
      }
    }, warningTime);

    // Set logout timer
    const logoutTime = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      if (timeSinceLastActivity >= logoutTime) {
        toast({
          title: "Session Expired",
          description: "You have been automatically logged out due to inactivity.",
          variant: "destructive",
        });
        signOut();
      }
    }, logoutTime);
  }, [timeoutMinutes, warningMinutes, signOut, toast]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Only set up inactivity detection if user is logged in
    if (!user) {
      // Clear timers when user is not logged in
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
      return;
    }

    // Set initial timer
    resetTimer();

    // Add event listeners for user activity
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [user, events, handleActivity, resetTimer]);

  // Return function to manually reset the timer (useful for API calls)
  return {
    resetInactivityTimer: resetTimer,
    lastActivityTime: lastActivityRef.current
  };
}
