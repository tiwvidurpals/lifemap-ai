
import { CalendarDays, ClipboardList, FileText, Target, RefreshCw, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

type SidebarProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const Sidebar = ({ currentPage, setCurrentPage }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const sidebarItems = [
    { id: "weekly", label: "Weekly Timeline", icon: CalendarDays },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "year-plan", label: "1 Year Plan", icon: Target },
    { id: "long-term", label: "Multi-Year Plan", icon: RefreshCw },
    { id: "life-goals", label: "Life Goals", icon: ClipboardList },
  ];
  
  return (
    <div className={cn(
      "h-full bg-card border-r transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && <h2 className="font-bold text-lg">LifeMap</h2>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="flex flex-col gap-1 p-2 flex-1">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={currentPage === item.id ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-3 h-10",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => setCurrentPage(item.id)}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
