import Navbar from "@/components/dashboard/Navbar";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import FarmControlPanel from "@/components/dashboard/FarmControlPanel";
import IrrigationSchedule from "@/components/dashboard/IrrigationSchedule";
import SoilWaterAnalytics from "@/components/dashboard/SoilWaterAnalytics";
import AIDecisionPanel from "@/components/dashboard/AIDecisionPanel";
import WeatherAndControls from "@/components/dashboard/WeatherAndControls";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        <WelcomeCard />
        <FarmControlPanel />
        <IrrigationSchedule />
        <SoilWaterAnalytics />
        <AIDecisionPanel />
        <WeatherAndControls />
      </main>
    </div>
  );
};

export default Index;
