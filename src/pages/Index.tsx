import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import WeeklyTimeline from "@/components/WeeklyTimeline";
import Notes from "@/components/Notes";
import YearPlan from "@/components/YearPlan";
import MultiYearPlan from "@/components/MultiYearPlan";
import LifeGoals from "@/components/LifeGoals";
import MonthPlan from "@/components/MonthPlan";

const MonthPlanPlaceholder = () => (
  <div className="p-8 text-center text-muted-foreground">
    <h2 className="text-2xl font-bold mb-2">1 Month Plan</h2>
    <p>This feature is coming soon!</p>
  </div>
);

const Index = () => {
  const [currentPage, setCurrentPage] = useState("weekly");

  // Render the appropriate component based on the current page
  const renderPage = () => {
    switch (currentPage) {
      case "weekly":
        return <WeeklyTimeline />;
      case "notes":
        return <Notes />;
      case "month-plan":
        return <MonthPlan />;
      case "year-plan":
        return <YearPlan />;
      case "long-term":
        return <MultiYearPlan />;
      case "life-goals":
        return <LifeGoals />;
      default:
        return <WeeklyTimeline />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 w-full h-[calc(100vh-4rem)] md:h-screen overflow-hidden flex flex-col pt-14 md:pt-0">
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Index;
