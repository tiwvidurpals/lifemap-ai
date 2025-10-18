import React, { useState, useEffect } from 'react';
import { useInactivityLogout } from '@/hooks/use-inactivity-logout';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Test component to verify inactivity logout functionality
 * This component can be temporarily added to test the 6-hour inactivity logout
 */
export const InactivityLogoutTest: React.FC = () => {
  const { user } = useAuth();
  const { resetInactivityTimer, lastActivityTime } = useInactivityLogout({
    timeoutMinutes: 1, // Test with 1 minute for quick testing
    warningMinutes: 0.5, // Warning after 30 seconds
  });
  const [timeSinceLastActivity, setTimeSinceLastActivity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceLastActivity(Math.floor((Date.now() - lastActivityTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivityTime]);

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Inactivity Logout Test</CardTitle>
          <CardDescription>Please log in to test the inactivity logout functionality</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Inactivity Logout Test</CardTitle>
        <CardDescription>
          Testing with 1-minute timeout (30-second warning)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>Time since last activity: {timeSinceLastActivity} seconds</p>
          <p>Last activity time: {new Date(lastActivityTime).toLocaleTimeString()}</p>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={resetInactivityTimer}
            className="w-full"
          >
            Reset Activity Timer
          </Button>
          
          <p className="text-xs text-gray-500">
            Click the button above to reset the inactivity timer.
            You should see a warning after 30 seconds of inactivity,
            and be logged out after 1 minute of inactivity.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
