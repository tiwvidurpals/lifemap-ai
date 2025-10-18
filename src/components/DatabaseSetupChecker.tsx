import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Database, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseStatus {
  connected: boolean;
  tablesExist: boolean;
  userAuthenticated: boolean;
  error?: string;
}

export const DatabaseSetupChecker = () => {
  const [status, setStatus] = useState<DatabaseStatus>({
    connected: false,
    tablesExist: false,
    userAuthenticated: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      const userAuthenticated = !!user;

      // Check if tables exist by trying to query the notes table
      let tablesExist = false;
      let connected = false;
      let error: string | undefined;

      try {
        const { error: queryError } = await supabase
          .from('notes')
          .select('count')
          .limit(1);
        
        if (queryError) {
          if (queryError.code === 'PGRST116') {
            error = 'Database tables not found. Please run the migration.';
          } else {
            error = `Database error: ${queryError.message}`;
          }
        } else {
          tablesExist = true;
          connected = true;
        }
      } catch (err) {
        error = `Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`;
      }

      setStatus({
        connected,
        tablesExist,
        userAuthenticated,
        error
      });
    } catch (err) {
      setStatus({
        connected: false,
        tablesExist: false,
        userAuthenticated: false,
        error: `Setup error: ${err instanceof Error ? err.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Checking Database Setup...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allGood = status.connected && status.tablesExist && status.userAuthenticated;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Setup Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {status.userAuthenticated ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className={status.userAuthenticated ? 'text-green-700' : 'text-red-700'}>
              User Authentication: {status.userAuthenticated ? 'Connected' : 'Not authenticated'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {status.connected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className={status.connected ? 'text-green-700' : 'text-red-700'}>
              Database Connection: {status.connected ? 'Connected' : 'Failed'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {status.tablesExist ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className={status.tablesExist ? 'text-green-700' : 'text-red-700'}>
              Database Tables: {status.tablesExist ? 'Created' : 'Missing'}
            </span>
          </div>
        </div>

        {status.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        {allGood ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Database is properly configured! You can now create and manage your notes.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Database setup is incomplete. Please follow these steps:
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">1.</span>
                <span>Set up your Supabase project</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">2.</span>
                <span>Run the database migration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">3.</span>
                <span>Configure authentication</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.open('/SUPABASE_SETUP.md', '_blank')}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                View Setup Guide
              </Button>
              <Button onClick={checkDatabaseStatus} variant="outline">
                Check Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

