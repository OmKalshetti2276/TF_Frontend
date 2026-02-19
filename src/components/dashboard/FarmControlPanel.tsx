import { motion } from "framer-motion";
import { useState } from "react";
import { predictZone } from "@/services/api";
import {
  Thermometer, Droplets, Wind, Sun, CloudRain, Gauge,
  Power
} from "lucide-react";

type ZoneStatus = "irrigated" | "scheduled" | "needs-irrigation" | "offline";

interface Zone {
  name: string;
  moisture: number;
  valveOpen: boolean;
  flowRate: string;
  status: ZoneStatus;
  aiRecommendation: string;
}

const initialZones: Zone[] = [
  { name: "Zone A", moisture: 42, valveOpen: true, flowRate: "12 L/min", status: "irrigated", aiRecommendation: "Irrigating" },
  { name: "Zone B", moisture: 68, valveOpen: false, flowRate: "0 L/min", status: "scheduled", aiRecommendation: "Scheduled 2:00 PM" },
  { name: "Zone C", moisture: 28, valveOpen: false, flowRate: "0 L/min", status: "needs-irrigation", aiRecommendation: "Urgent: Low moisture" },
];

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
                status: response.action === "IRRIGATE" ? "irrigated" : "scheduled",
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

        {/* Weather Station */}
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
                <p className="text-[10px] text-muted-foreground">{w.label}</p>
                <p className="text-sm font-bold text-card-foreground">{w.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Zones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {zones.map((zone, i) => (
            <div
              key={zone.name}
              className="rounded-2xl border-2 p-4"
            >
              <h4 className="font-bold mb-2">{zone.name}</h4>

              <div className="text-sm mb-1">
                Soil Moisture: {zone.moisture}%
              </div>

              <div className="text-sm mb-1">
                Flow Rate: {zone.flowRate}
              </div>

              <div className="text-xs mb-2">
                🤖 {zone.aiRecommendation}
              </div>

              <button
                onClick={() => toggleValve(i)}
                className="w-full rounded-xl py-2 text-xs font-semibold bg-muted"
              >
                Valve: {zone.valveOpen ? "Open" : "Closed"}
              </button>
            </div>
          ))}
        </div>

        {/* Pump */}
        <div className="rounded-2xl bg-muted/50 p-4 space-y-4">
          <h3 className="font-bold">⚙️ Pump Control</h3>

          <div className="flex flex-col items-center gap-3">
            <Power className={`h-7 w-7 ${pumpOn ? "text-green-500" : "text-red-500"}`} />
            <span>{pumpOn ? "RUNNING" : "OFF"}</span>
          </div>

          <button
            onClick={() => setPumpOn(!pumpOn)}
            className="w-full rounded-xl py-2 text-xs font-semibold bg-muted"
          >
            {pumpOn ? "Stop Pump" : "Start Pump"}
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default FarmControlPanel;
