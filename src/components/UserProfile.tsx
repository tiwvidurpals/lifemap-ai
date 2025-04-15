
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User } from "lucide-react";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="p-4 border-t mt-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="text-sm truncate">
            {user.email || 'User'}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          title="Sign out"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
