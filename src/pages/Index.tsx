
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import WeeklyTimeline from "@/components/WeeklyTimeline";
import Notes from "@/components/Notes";
import YearPlan from "@/components/YearPlan";
import MultiYearPlan from "@/components/MultiYearPlan";
import LifeGoals from "@/components/LifeGoals";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("weekly");

  // Render the appropriate component based on the current page
  const renderPage = () => {
    switch (currentPage) {
      case "weekly":
        return <WeeklyTimeline />;
      case "notes":
        return <Notes />;
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
    <div className="min-h-screen flex bg-background">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
