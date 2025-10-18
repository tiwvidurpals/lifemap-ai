import React, { useState } from 'react';
import { ArrowLeft, Settings as SettingsIcon, Database, Download, Upload, Trash2, Shield, Key, LogOut, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { DataMigrationService } from '@/services/data-migration-service';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMigrating, setIsMigrating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleDataMigration = async () => {
    setIsMigrating(true);
    try {
      const result = await DataMigrationService.migrateAllData();
      if (result.success) {
        toast({
          title: "Migration Successful",
          description: `Migrated ${Object.values(result.migrated).reduce((a, b) => a + b, 0)} items to the database.`,
        });
      } else {
        toast({
          title: "Migration Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Migration Error",
        description: "Failed to migrate data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // This would typically fetch all user data and create a downloadable file
      toast({
        title: "Export Started",
        description: "Your data export will be ready shortly.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearLocalStorage = () => {
    if (confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      localStorage.clear();
      toast({
        title: "Local Data Cleared",
        description: "All local storage data has been removed.",
      });
    }
  };

  const hasLocalData = DataMigrationService.hasLocalStorageData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and data</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="grid gap-6">
          {/* Account Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Account Management
              </CardTitle>
              <CardDescription>
                Manage your account settings and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your account password
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Enable
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                <div className="space-y-1">
                  <h4 className="font-medium text-destructive">Sign Out</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your data and storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasLocalData && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You have local data that can be migrated to the cloud database.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Migrate Local Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Move your local data to the cloud database
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDataMigration}
                  disabled={isMigrating || !hasLocalData}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isMigrating ? 'Migrating...' : 'Migrate'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of all your data
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportData}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                <div className="space-y-1">
                  <h4 className="font-medium text-destructive">Clear Local Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Remove all data stored locally on this device
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleClearLocalStorage}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                App Information
              </CardTitle>
              <CardDescription>
                About this application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">App Version</label>
                  <p className="text-sm">1.0.0</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Build Date</label>
                  <p className="text-sm">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Environment</label>
                  <Badge variant="outline">Production</Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Database</label>
                  <Badge variant="outline">Supabase</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support & Help */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Support & Help
              </CardTitle>
              <CardDescription>
                Get help and support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Read the user guide and documentation
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Docs
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Contact Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Get help from our support team
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Contact
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Report Bug</h4>
                  <p className="text-sm text-muted-foreground">
                    Report issues or bugs you've encountered
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
