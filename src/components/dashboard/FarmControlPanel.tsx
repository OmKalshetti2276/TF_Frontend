import { motion } from "framer-motion";
import { useState } from "react";
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

  const toggleValve = (index: number) => {
    setZones(prev => prev.map((z, i) => i === index ? { ...z, valveOpen: !z.valveOpen } : z));
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

        {/* Center - Field Layout */}
        <div className="space-y-4">
          {/* Pipeline visualization */}
          <div className="flex items-center gap-2 px-2">
            <div className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse-soft" />
              <span className="text-xs font-semibold text-secondary">Water Tank</span>
            </div>
            <div className={`flex-1 h-1 rounded-full transition-colors duration-500 ${pumpOn ? "bg-secondary animate-flow-glow" : "bg-muted"}`} />
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
              <Power className={`h-3 w-3 ${pumpOn ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-semibold text-card-foreground">Pump</span>
            </div>
            <div className={`flex-1 h-1 rounded-full transition-colors duration-500 ${pumpOn ? "bg-secondary animate-flow-glow" : "bg-muted"}`} />
            <span className="text-xs font-medium text-muted-foreground">→ Zones</span>
          </div>

          {/* Zone grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {zones.map((zone, i) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                onClick={() => setSelectedZone(zone)}
                className={`relative rounded-2xl border-2 p-4 cursor-pointer transition-all hover:shadow-elevated ${statusColors[zone.status]}`}
              >
                {/* Branch pipe */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full ${pumpOn && zone.valveOpen ? "bg-secondary" : "bg-muted"}`} />

                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display text-sm font-bold text-card-foreground">{zone.name}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadgeColors[zone.status]}`}>
                    {statusLabels[zone.status]}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Soil Moisture</span>
                    <span className="font-bold text-card-foreground">{zone.moisture}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-primary transition-all duration-500"
                      style={{ width: `${zone.moisture}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flow Rate</span>
                    <span className="font-bold text-card-foreground">{zone.flowRate}</span>
                  </div>
                </div>

                {/* AI badge */}
                <div className="mt-3 rounded-lg bg-card/80 px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">
                  🤖 {zone.aiRecommendation}
                </div>

                {/* Valve */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleValve(i); }}
                  className={`mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors ${
                    zone.valveOpen
                      ? "bg-primary/15 text-primary"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  <CircleDot className={`h-3.5 w-3.5 ${zone.valveOpen ? "animate-pulse-soft" : ""}`} />
                  Valve: {zone.valveOpen ? "Open" : "Closed"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pump Control - Right */}
        <div className="rounded-2xl bg-muted/50 p-4 space-y-4">
          <h3 className="font-display text-sm font-bold text-card-foreground">⚙️ Pump Control</h3>

          <div className="flex flex-col items-center gap-3">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-500 ${
              pumpOn ? "bg-primary/20 shadow-[0_0_20px_hsl(152_55%_42%/0.4)]" : "bg-destructive/20 shadow-[0_0_20px_hsl(0_72%_55%/0.3)]"
            }`}>
              <Power className={`h-7 w-7 ${pumpOn ? "text-primary" : "text-destructive"}`} />
            </div>
            <span className={`text-sm font-bold ${pumpOn ? "text-primary" : "text-destructive"}`}>
              {pumpOn ? "RUNNING" : "OFF"}
            </span>
          </div>

          <button
            onClick={() => setPumpOn(!pumpOn)}
            className={`w-full rounded-xl py-2.5 text-xs font-semibold transition-colors ${
              pumpOn
                ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
                : "bg-primary/15 text-primary hover:bg-primary/25"
            }`}
          >
            {pumpOn ? "Stop Pump" : "Start Pump"}
          </button>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Power</span>
              <span className="font-bold text-card-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-aqua-orange" />
                {pumpOn ? "2.4 kW" : "0 kW"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pressure</span>
              <span className="font-bold text-card-foreground">{pumpOn ? "3.2 bar" : "0 bar"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-bold ${pumpOn ? "text-primary" : "text-muted-foreground"}`}>
                {pumpOn ? "Normal" : "Standby"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Detail Modal */}
      {selectedZone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
          onClick={() => setSelectedZone(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl p-6 shadow-elevated max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-card-foreground">{selectedZone.name} Details</h3>
              <button onClick={() => setSelectedZone(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-muted-foreground">Soil Moisture</span>
                <span className="font-bold text-card-foreground">{selectedZone.moisture}%</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-muted-foreground">Valve Status</span>
                <span className={`font-bold ${selectedZone.valveOpen ? "text-primary" : "text-destructive"}`}>
                  {selectedZone.valveOpen ? "Open" : "Closed"}
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-muted-foreground">Flow Rate</span>
                <span className="font-bold text-card-foreground">{selectedZone.flowRate}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-muted-foreground">Status</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeColors[selectedZone.status]}`}>
                  {statusLabels[selectedZone.status]}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-muted-foreground mb-1">AI Recommendation</p>
                <p className="font-medium text-card-foreground">🤖 {selectedZone.aiRecommendation}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FarmControlPanel;
