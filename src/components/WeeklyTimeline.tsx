import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Initialize or load weeks
  useEffect(() => {
    const storedWeeks = localStorage.getItem("weeklyTimeline");
    if (storedWeeks) {
      const parsedWeeks = JSON.parse(storedWeeks).map((week: any) => ({
        ...week,
        startDate: new Date(week.startDate),
        endDate: new Date(week.endDate)
      }));
      setWeeks(parsedWeeks);
    } else {
      generateWeeks(currentYear);
    }
  }, [currentYear]);

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
      newWeeks.push({
        id: `${year}-${weekNum}`,
        startDate: start,
        endDate: end,
        notes: "",
        color: "",
        title: `Week ${weekNum}, ${year}`,
      });
    }
    
    setWeeks(prevWeeks => {
      // Merge with existing weeks to keep user data
      const existingWeeksMap = new Map(prevWeeks.map(w => [w.id, w]));
      return newWeeks.map(week => existingWeeksMap.has(week.id) ? existingWeeksMap.get(week.id)! : week);
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

  // Get current week
  const currentWeekNumber = getWeekNumber(new Date());
  const currentWeekId = `${new Date().getFullYear()}-${currentWeekNumber}`;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold">Weekly Timeline</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadPreviousYear}>
            Previous Year
          </Button>
          <span className="font-medium">{currentYear}</span>
          <Button variant="outline" size="sm" onClick={loadNextYear}>
            Next Year
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={loadPreviousWeeks}
          disabled={displayRange.start === 0}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        <span>
          Weeks {displayRange.start + 1} - {displayRange.end + 1}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={loadNextWeeks}
          disabled={displayRange.end >= weeks.length - 1}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-auto">
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
              <div className="text-sm text-muted-foreground">
                {formatDate(week.startDate)} - {formatDate(week.endDate)}
              </div>
            </CardHeader>
            <CardContent>
              {editing === week.id ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Notes</label>
                    <Textarea 
                      placeholder="Add notes about this week..."
                      value={editData.notes}
                      onChange={(e) => setEditData({...editData, notes: e.target.value})}
                      className="resize-none h-24"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Color</label>
                    <div className="flex flex-wrap gap-1">
                      {colorOptions.map(option => (
                        <Button
                          key={option.value}
                          type="button"
                          size="sm"
                          variant={editData.color === option.value ? "default" : "outline"}
                          onClick={() => setEditData({...editData, color: option.value})}
                          className={cn(
                            "h-7 rounded-full",
                            option.value && option.value.split(' ')[0]
                          )}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[80px]">
                  {week.notes ? (
                    <p className="text-sm whitespace-pre-wrap">{week.notes}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No notes for this week</p>
                  )}
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
