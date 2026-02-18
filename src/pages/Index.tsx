import Navbar from "@/components/dashboard/Navbar";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IrrigationSchedule />
          <div className="space-y-6 lg:hidden">
            {/* Mobile: analytics below schedule */}
          </div>
        </div>
        <SoilWaterAnalytics />
        <AIDecisionPanel />
        <WeatherAndControls />
      </main>
    </div>
  );
};

export default Index;
