import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Week interface
interface WeekData {
  id: string;
  startDate: Date;
  endDate: Date;
  notes: string;
  color: string;
  title: string;
}

// Interface for stored week data (with string dates)
interface StoredWeekData {
  id: string;
  startDate: string;
  endDate: string;
  notes: string;
  color: string;
  title: string;
}

// Get ISO week number
const getWeekNumber = (date: Date): number => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Get start and end date of a week based on week number and year
const getWeekDates = (weekNumber: number, year: number): { start: Date; end: Date } => {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (8 - firstDayOfYear.getDay()) % 7;
  
  const firstWeekStartDate = new Date(year, 0, 1 + daysOffset);
  const weekStartDate = new Date(firstWeekStartDate);
  weekStartDate.setDate(firstWeekStartDate.getDate() + (weekNumber - 1) * 7);
  
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);
  
  return { start: weekStartDate, end: weekEndDate };
};

// Format date to string
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const WeeklyTimeline = () => {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ notes: string; color: string; title: string }>({
    notes: "",
    color: "",
    title: ""
  });
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [displayRange, setDisplayRange] = useState({ start: 0, end: 11 });
  const { toast } = useToast();

  // Calculate current week info
  const today = new Date();
  const currentWeekNumber = getWeekNumber(today);
  const currentWeekId = `${today.getFullYear()}-${currentWeekNumber}`;

  // Initialize or load weeks
  useEffect(() => {
    const storedWeeks = localStorage.getItem("weeklyTimeline");
    if (storedWeeks) {
      const parsedWeeks = JSON.parse(storedWeeks).map((week: StoredWeekData) => ({
        ...week,
        startDate: new Date(week.startDate),
        endDate: new Date(week.endDate)
      }));
      setWeeks(parsedWeeks);
      
      // Set display range to show current week
      const currentWeekIndex = parsedWeeks.findIndex((week: WeekData) => week.id === currentWeekId);
      if (currentWeekIndex >= 0) {
        const start = Math.max(0, currentWeekIndex - 2); // Show 2 weeks before current
        const end = Math.min(parsedWeeks.length - 1, start + 11); // Show 12 weeks total
        setDisplayRange({ start, end });
      }
    } else {
      generateWeeks(currentYear);
    }
  }, [currentYear, currentWeekId]);

  // Save to localStorage when weeks change
  useEffect(() => {
    if (weeks.length > 0) {
      localStorage.setItem("weeklyTimeline", JSON.stringify(weeks));
    }
  }, [weeks]);

  // Generate weeks for a year
  const generateWeeks = (year: number) => {
    const newWeeks: WeekData[] = [];
    const totalWeeks = 52;
    
    for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
      const { start, end } = getWeekDates(weekNum, year);
      
      // Create a meaningful title with date range
      const weekTitle = `Week ${weekNum}: ${formatDate(start)} - ${formatDate(end)}`;
      
      newWeeks.push({
        id: `${year}-${weekNum}`,
        startDate: start,
        endDate: end,
        notes: "",
        color: "",
        title: weekTitle,
      });
    }
    
    setWeeks(prevWeeks => {
      // Merge with existing weeks to keep user data
      const existingWeeksMap = new Map(prevWeeks.map(w => [w.id, w]));
      const mergedWeeks = newWeeks.map(week => {
        if (existingWeeksMap.has(week.id)) {
          const existingWeek = existingWeeksMap.get(week.id)!;
          // Preserve user data but update dates and title format
          return {
            ...existingWeek,
            startDate: week.startDate,
            endDate: week.endDate,
            title: existingWeek.title === `Week ${week.id.split('-')[1]}, ${year}` 
              ? week.title 
              : existingWeek.title
          };
        }
        return week;
      });
      
      // Set display range to show current week
      const currentWeekIndex = mergedWeeks.findIndex(week => week.id === currentWeekId);
      if (currentWeekIndex >= 0) {
        const start = Math.max(0, currentWeekIndex - 2); // Show 2 weeks before current
        const end = Math.min(mergedWeeks.length - 1, start + 11); // Show 12 weeks total
        setDisplayRange({ start, end });
      }
      
      return mergedWeeks;
    });
  };

  const startEditing = (week: WeekData) => {
    setEditing(week.id);
    setEditData({
      notes: week.notes,
      color: week.color,
      title: week.title
    });
  };

  const saveEditing = () => {
    if (!editing) return;
    
    setWeeks(weeks.map(week => 
      week.id === editing 
        ? { ...week, notes: editData.notes, color: editData.color, title: editData.title } 
        : week
    ));
    
    setEditing(null);
    
    toast({
      title: "Week updated",
      description: "Your changes have been saved."
    });
  };

  const cancelEditing = () => {
    setEditing(null);
  };

  const colorOptions = [
    { label: "Default", value: "" },
    { label: "Blue", value: "bg-lifemap-blue text-white" },
    { label: "Green", value: "bg-lifemap-green text-white" },
    { label: "Purple", value: "bg-lifemap-purple text-white" },
    { label: "Red", value: "bg-lifemap-red text-white" },
    { label: "Yellow", value: "bg-lifemap-yellow text-black" },
  ];

  const loadPreviousYear = () => {
    setCurrentYear(prev => prev - 1);
  };

  const loadNextYear = () => {
    setCurrentYear(prev => prev + 1);
  };

  const loadPreviousWeeks = () => {
    setDisplayRange(prev => ({
      start: Math.max(0, prev.start - 12),
      end: Math.max(11, prev.end - 12)
    }));
  };

  const loadNextWeeks = () => {
    setDisplayRange(prev => ({
      start: Math.min(weeks.length - 12, prev.start + 12),
      end: Math.min(weeks.length - 1, prev.end + 12)
    }));
  };

  // Jump to current week
  const jumpToCurrentWeek = () => {
    const currentWeekIndex = weeks.findIndex(week => week.id === currentWeekId);
    if (currentWeekIndex >= 0) {
      const start = Math.max(0, currentWeekIndex - 2); // Show 2 weeks before current
      const end = Math.min(weeks.length - 1, start + 11); // Show 12 weeks total
      setDisplayRange({ start, end });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main header - completely fixed for all sizes */}
      <div className="flex flex-col border-b">
        {/* Title row */}
        <div className="flex items-center justify-center relative py-4 px-4">
          <h1 className="text-2xl font-bold text-center">Weekly Timeline</h1>
        </div>
        
        {/* Year navigation row */}
        <div className="flex items-center justify-center py-2 px-4 border-t">
          <Button variant="outline" size="sm" onClick={loadPreviousYear} className="flex-shrink-0">
            Previous Year
          </Button>
          <span className="font-medium mx-3">{currentYear}</span>
          <Button variant="outline" size="sm" onClick={loadNextYear} className="flex-shrink-0">
            Next Year
          </Button>
        </div>
      </div>
      
      {/* Week navigation controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={loadPreviousWeeks}
          disabled={displayRange.start === 0}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        
        <div className="flex flex-col md:flex-row items-center gap-2 order-3 md:order-2 w-full md:w-auto justify-center mt-2 md:mt-0">
          <span className="text-sm font-medium">
            Weeks {displayRange.start + 1} - {displayRange.end + 1}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={jumpToCurrentWeek}
            className="flex items-center gap-1"
          >
            <CalendarDays size={16} />
            <span>Current Week</span>
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={loadNextWeeks}
          disabled={displayRange.end >= weeks.length - 1}
          className="flex items-center gap-1 order-2 md:order-3"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Week cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-y-auto">
        {weeks.slice(displayRange.start, displayRange.end + 1).map((week) => (
          <Card 
            key={week.id} 
            className={cn(
              "transition-all duration-200",
              week.color,
              week.id === currentWeekId && !week.color && "border-primary border-2",
              editing === week.id && "ring-2 ring-primary"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  {editing === week.id ? (
                    <Input 
                      value={editData.title} 
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="h-8 text-base"
                    />
                  ) : (
                    week.title
                  )}
                </CardTitle>
                {editing === week.id ? (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={saveEditing} className="h-7 w-7">
                      <Check size={16} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={cancelEditing} className="h-7 w-7">
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <Button size="icon" variant="ghost" onClick={() => startEditing(week)} className="h-7 w-7">
                    <Edit2 size={16} />
                  </Button>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDate(week.startDate)} - {formatDate(week.endDate)}
              </div>
            </CardHeader>
            <CardContent>
              {editing === week.id ? (
                <div className="space-y-2">
                  <Textarea 
                    value={editData.notes} 
                    onChange={(e) => setEditData({...editData, notes: e.target.value})}
                    placeholder="Add notes for this week..."
                    className="min-h-[100px] text-sm"
                  />
                  <div>
                    <label className="text-xs font-medium mb-1 block">Color</label>
                    <select 
                      value={editData.color}
                      onChange={(e) => setEditData({...editData, color: e.target.value})}
                      className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="min-h-[100px] text-sm whitespace-pre-wrap">
                  {week.notes || <span className="text-muted-foreground italic">No notes for this week yet.</span>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeeklyTimeline;
