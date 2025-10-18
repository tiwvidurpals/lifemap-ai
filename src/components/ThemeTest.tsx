import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { ThemeToggle, SimpleThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Test component to verify theme functionality
 * This component can be temporarily added to test the theme switching
 */
export const ThemeTest: React.FC = () => {
  const { theme, actualTheme } = useTheme();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Theme Test</CardTitle>
        <CardDescription>
          Test the light and dark theme functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Theme:</span>
            <Badge variant="outline">{theme}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Actual Theme:</span>
            <Badge variant="outline">{actualTheme}</Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Theme Controls:</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm">Full Toggle:</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Simple Toggle:</span>
            <SimpleThemeToggle />
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>• The full toggle allows switching between Light, Dark, and System themes</p>
          <p>• The simple toggle switches between Light and Dark only</p>
          <p>• System theme follows your device's preference</p>
          <p>• Theme preference is saved to localStorage</p>
        </div>
      </CardContent>
    </Card>
  );
};
