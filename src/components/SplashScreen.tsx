
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

const SplashScreen = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(!Capacitor.isNativePlatform());

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Simulate app initialization
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-background animate-fade-in">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-primary">LM</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">LifeMap</h1>
          <p className="text-muted-foreground">Your personal roadmap to success</p>
          <div className="w-32 h-1 bg-secondary rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SplashScreen;
