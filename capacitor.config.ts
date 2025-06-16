
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.a10ce10c330b4970abe60eada98fa75b',
  appName: 'lifemap-ai',
  webDir: 'dist',
  server: {
    url: 'https://a10ce10c-330b-4970-abe6-0eada98fa75b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;
