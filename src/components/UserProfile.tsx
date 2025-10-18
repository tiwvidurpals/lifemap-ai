
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  if (!user) return null;
  
  const handleSignOut = async () => {
    console.log('[UserProfile] Sign out button clicked');
    setIsLoggingOut(true);
    try {
      await signOut();
      console.log('[UserProfile] Sign out completed successfully');
    } catch (error) {
      console.error('[UserProfile] Error signing out:', error);
      // Error handling is already done in the signOut function
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  // Mobile layout - full width with better spacing
  if (isMobile) {
    return (
      <div className="p-4 border-t bg-card/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">
                {user.user_metadata?.full_name || 'User'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="shrink-0 hover:bg-destructive hover:text-destructive-foreground"
            title="Sign out"
          >
            <LogOut size={16} />
            {isLoggingOut && <span className="ml-2 text-xs">Signing out...</span>}
          </Button>
        </div>
      </div>
    );
  }
  
  // Desktop layout - dropdown menu
  return (
    <div className="p-4 border-t mt-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent"
          >
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              <User size={16} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium truncate">
                {user.user_metadata?.full_name || 'User'}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {user.email}
              </div>
            </div>
            <ChevronDown size={16} className="shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;
