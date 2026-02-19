import { motion } from "framer-motion";
import { useState } from "react";
import { predictZone } from "@/services/api"; // ✅ Added
import {
  Thermometer, Droplets, Wind, Sun, CloudRain, Gauge,
  Power, Zap, CircleDot, X
} from "lucide-react";

type ZoneStatus = "irrigated" | "scheduled" | "needs-irrigation" | "offline";

interface Zone {
  name: string;
  moisture: number;
  valveOpen: boolean;
  flowRate: string;
  status: ZoneStatus;
  aiRecommendation: string;
  predictedMoisture?: number;
  recommendedSeconds?: number;
}


const initialZones: Zone[] = [
  { name: "Zone A", moisture: 42, valveOpen: true, flowRate: "12 L/min", status: "irrigated", aiRecommendation: "Irrigating" },
  { name: "Zone B", moisture: 68, valveOpen: false, flowRate: "0 L/min", status: "scheduled", aiRecommendation: "Scheduled 2:00 PM" },
  { name: "Zone C", moisture: 28, valveOpen: false, flowRate: "0 L/min", status: "needs-irrigation", aiRecommendation: "Urgent: Low moisture" },
];

const statusColors: Record<ZoneStatus, string> = {
  irrigated: "border-primary bg-primary/10",
  scheduled: "border-aqua-yellow bg-aqua-yellow/10",
  "needs-irrigation": "border-destructive bg-destructive/10",
  offline: "border-aqua-gray bg-muted",
};

const statusBadgeColors: Record<ZoneStatus, string> = {
  irrigated: "bg-primary/15 text-primary",
  scheduled: "bg-aqua-yellow/15 text-aqua-yellow",
  "needs-irrigation": "bg-destructive/15 text-destructive",
  offline: "bg-muted text-muted-foreground",
};

const statusLabels: Record<ZoneStatus, string> = {
  irrigated: "Irrigated",
  scheduled: "Scheduled",
  "needs-irrigation": "Needs Irrigation",
  offline: "Offline",
};

const weatherStation = [
  { label: "Temperature", value: "28°C", icon: Thermometer },
  { label: "Humidity", value: "72%", icon: Droplets },
  { label: "Wind Speed", value: "12 km/h", icon: Wind },
  { label: "Solar Radiation", value: "680 W/m²", icon: Sun },
  { label: "Rainfall", value: "0 mm", icon: CloudRain },
  { label: "ET Value", value: "4.2 mm/d", icon: Gauge },
];

const FarmControlPanel = () => {
  const [zones, setZones] = useState(initialZones);
  const [pumpOn, setPumpOn] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // ✅ AI Decision Integration
  // ✅ AI Decision Integration (Aligned with Backend)
const runAIDecision = async (index: number) => {
  try {
    const zone = zones[index];

    const response = await predictZone({
      soil_moisture: zone.moisture,
      soil_moisture_lag1: zone.moisture,
      latitude: 18.52,
      longitude: 73.85,
      soil_type: "loamy",
      slope: "flat",
      crop_kc: 1.1,
      calibration_factor: 4
    });

    setZones(prev =>
      prev.map((z, i) =>
        i === index
          ? {
              ...z,
              moisture: response.predicted_moisture ?? z.moisture,
              status:
                response.action === "IRRIGATE"
                  ? "irrigated"
                  : "scheduled",
              aiRecommendation:
                response.action === "IRRIGATE"
                  ? `Irrigate for ${response.recommended_valve_seconds ?? 0}s`
                  : "No irrigation required",
            }
          : z
      )
    );

  } catch (error) {
    console.error("AI error:", error);
  }
};


  // ✅ Updated Valve Toggle
  const toggleValve = async (index: number) => {
    setZones(prev =>
      prev.map((z, i) =>
        i === index ? { ...z, valveOpen: !z.valveOpen } : z
      )
    );

    await runAIDecision(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <h2 className="font-display text-lg font-bold text-card-foreground mb-5">
        Farm Irrigation Control Panel
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_200px] gap-5">
        
        {/* Weather Station - Left */}
        <div className="rounded-2xl bg-secondary/10 p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-secondary flex items-center gap-2">
            <CloudRain className="h-4 w-4" /> Weather Station
          </h3>
          {weatherStation.map((w) => (
            <div key={w.label} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/15">
                <w.icon className="h-3.5 w-3.5 text-secondary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground leading-none">{w.label}</p>
                <p className="text-sm font-bold text-card-foreground">{w.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Center and Pump sections remain EXACTLY SAME */}
        {/* I did NOT modify anything below visually */}

        {/* --- YOUR ENTIRE ORIGINAL UI CODE CONTINUES UNCHANGED --- */}
        {/* (Omitted here for brevity explanation — but in your file, leave everything exactly as before) */}

      </div>
    </motion.div>
  );
};

export default FarmControlPanel;
