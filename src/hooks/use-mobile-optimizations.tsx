
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function useMobileOptimizations() {
  useEffect(() => {
    // Add mobile-specific optimizations
    if (Capacitor.isNativePlatform()) {
      // Prevent zoom on iOS
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }

      // Add mobile-specific classes
      document.body.classList.add('mobile-app');
      
      // Prevent default touch behaviors that might interfere with the app
      document.addEventListener('touchmove', (e) => {
        // Check if this is a multi-touch gesture (pinch to zoom)
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }, []);

  return {
    isMobile: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform()
  };
}
