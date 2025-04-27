import { CalendarDays, ClipboardList, FileText, Target, RefreshCw, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import UserProfile from "@/components/UserProfile";

type SidebarProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const Sidebar = ({ currentPage, setCurrentPage }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);
  
  const sidebarItems = [
    { id: "weekly", label: "Weekly Timeline", icon: CalendarDays },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "year-plan", label: "1 Year Plan", icon: Target },
    { id: "long-term", label: "Multi-Year Plan", icon: RefreshCw },
    { id: "life-goals", label: "Life Goals", icon: ClipboardList },
  ];
  
  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  
  // Mobile sidebar overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile toggle button */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden"
          aria-label="Menu"
        >
          <Menu size={20} />
        </Button>
        
        {/* Mobile sidebar */}
        <div className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
        />
        
        <div className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-card border-r shadow-lg transition-transform duration-300 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg">LifeMap</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </Button>
          </div>
          
          <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className="justify-start gap-3 h-10"
                onClick={() => handlePageChange(item.id)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
          
          <UserProfile />
        </div>
      </>
    );
  }
  
  // Desktop sidebar
  return (
    <div className={cn(
      "h-full bg-card border-r transition-all duration-300 flex flex-col shrink-0",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && <h2 className="font-bold text-lg">LifeMap</h2>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={currentPage === item.id ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-3 h-10",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => handlePageChange(item.id)}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </div>
      
      {!isCollapsed && <UserProfile />}
    </div>
  );
};

export default Sidebar;
