import { useState, useEffect } from 'react';

interface BruteForceState {
  failedAttempts: number;
  isBlocked: boolean;
  lastAttemptTime: number;
  blockUntil: number;
}

const BRUTE_FORCE_CONFIG = {
  MAX_ATTEMPTS: 5,
  BLOCK_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
  RESET_DURATION: 30 * 60 * 1000, // 30 minutes to reset attempts
};

const STORAGE_KEY = 'lifemap_brute_force_protection';

export function useBruteForceProtection() {
  const [state, setState] = useState<BruteForceState>(() => {
    // Load from localStorage on initialization
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        
        // Check if block period has expired
        if (parsed.blockUntil && now > parsed.blockUntil) {
          return {
            failedAttempts: 0,
            isBlocked: false,
            lastAttemptTime: 0,
            blockUntil: 0,
          };
        }
        
        // Check if reset period has passed
        if (parsed.lastAttemptTime && now - parsed.lastAttemptTime > BRUTE_FORCE_CONFIG.RESET_DURATION) {
          return {
            failedAttempts: 0,
            isBlocked: false,
            lastAttemptTime: 0,
            blockUntil: 0,
          };
        }
        
        return parsed;
      } catch {
        // Invalid stored data, reset
      }
    }
    
    return {
      failedAttempts: 0,
      isBlocked: false,
      lastAttemptTime: 0,
      blockUntil: 0,
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const recordFailedAttempt = (email: string) => {
    const now = Date.now();
    const newAttempts = state.failedAttempts + 1;
    
    if (newAttempts >= BRUTE_FORCE_CONFIG.MAX_ATTEMPTS) {
      // Block for 15 minutes
      setState({
        failedAttempts: newAttempts,
        isBlocked: true,
        lastAttemptTime: now,
        blockUntil: now + BRUTE_FORCE_CONFIG.BLOCK_DURATION,
      });
    } else {
      setState({
        ...state,
        failedAttempts: newAttempts,
        lastAttemptTime: now,
      });
    }
  };

  const recordSuccessfulAttempt = () => {
    setState({
      failedAttempts: 0,
      isBlocked: false,
      lastAttemptTime: 0,
      blockUntil: 0,
    });
  };

  const getRemainingBlockTime = () => {
    if (!state.isBlocked || !state.blockUntil) return 0;
    const remaining = state.blockUntil - Date.now();
    return Math.max(0, remaining);
  };

  const getRemainingAttempts = () => {
    return Math.max(0, BRUTE_FORCE_CONFIG.MAX_ATTEMPTS - state.failedAttempts);
  };

  const isEmailVerificationRequired = () => {
    return state.failedAttempts >= BRUTE_FORCE_CONFIG.MAX_ATTEMPTS;
  };

  const resetProtection = () => {
    setState({
      failedAttempts: 0,
      isBlocked: false,
      lastAttemptTime: 0,
      blockUntil: 0,
    });
  };

  const clearAllProtection = () => {
    // Clear all protection states and localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('lifemap_verification_code');
    setState({
      failedAttempts: 0,
      isBlocked: false,
      lastAttemptTime: 0,
      blockUntil: 0,
    });
  };

  return {
    failedAttempts: state.failedAttempts,
    isBlocked: state.isBlocked,
    isEmailVerificationRequired: isEmailVerificationRequired(),
    remainingAttempts: getRemainingAttempts(),
    remainingBlockTime: getRemainingBlockTime(),
    recordFailedAttempt,
    recordSuccessfulAttempt,
    resetProtection,
    clearAllProtection,
  };
}
