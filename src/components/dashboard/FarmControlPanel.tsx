import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { getZones } from "@/services/api";
import {
  Thermometer, Droplets, Wind, Sun, CloudRain, Gauge,
  Power, History
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

interface PredictionRecord {
  _id: string;
  timestamp: string;
  input_features: {
    soil_moisture_current: number;
    soil_type: string;
  };
  model_output: {
    predicted_moisture: number;
  };
  decision: {
    action: string;
    recommended_valve_seconds: number;
    water_volume_liters: number;
  };
}

const getWeather = async () => {
  const res = await fetch("https://smart-irrigation-api-cvo6.onrender.com/predictions/history");
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
};

const getHistory = async () => {
  const res = await fetch("https://smart-irrigation-api-cvo6.onrender.com/predictions/history");
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
};

const FarmControlPanel = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [pumpOn, setPumpOn] = useState(true);
  const [predictionHistory, setPredictionHistory] = useState<PredictionRecord[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Fix: Proper typing for backend response
  const convertBackendZones = (data: Record<string, any>): Zone[] => {
    return Object.entries(data).map(([name, zone]) => ({
      name,
      moisture: zone.moisture,
      valveOpen: zone.valve_open,
      flowRate: `${zone.flow_rate} L/min`,
      status: zone.moisture < 35 ? "needs-irrigation" : zone.valve_open ? "irrigated" : "scheduled",
      aiRecommendation: zone.last_decision === "IRRIGATE" ? `Irrigate for ${zone.recommended_seconds}s` : "No irrigation required",
    }));
  };

  useEffect(() => {
    setIsMounted(true);
    let isActive = true;

    const fetchInitialData = async () => {
      // Fix: Fetch independently to prevent cascading failures
      Promise.allSettled([getZones(), getWeather(), getHistory()]).then((results) => {
        if (!isActive) return;

        if (results[0].status === "fulfilled") setZones(convertBackendZones(results[0].value));
        else console.error("Zones fetch failed:", results[0].reason);

        if (results[1].status === "fulfilled") setWeatherData(results[1].value);
        else console.error("Weather fetch failed:", results[1].reason);

        if (results[2].status === "fulfilled") setPredictionHistory(results[2].value);
        else console.error("History fetch failed:", results[2].reason);
      });
    };

    fetchInitialData();
  


    const ws = new WebSocket("wss://smart-irrigation-api-cvo6.onrender.com/ws/dashboard");
    
    // Fix: Throttle/Debounce HTTP requests triggered by WebSocket
    let timeoutId: NodeJS.Timeout;

    ws.onmessage = (event) => {
      try {
        const newRecord = JSON.parse(event.data);
        
        // Ensure _id exists to prevent key collision
        if (!newRecord._id) newRecord._id = crypto.randomUUID();

        setPredictionHistory((prev) => [newRecord, ...prev].slice(0, 10));
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (isActive) {
             getZones()
              .then(data => setZones(convertBackendZones(data)))
              .catch(err => console.error("WS triggered zone fetch failed:", err));
          }
        }, 1000); 

      } catch (err) {
        console.error("WebSocket parsing error:", err);
      }
    };

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  const dynamicWeatherStation = weatherData ? [
    { label: "Temperature", value: weatherData[0].input_features.temperature, icon: Thermometer },
    { label: "Humidity", value: weatherData[0].input_features.humidity, icon: Droplets },
    { label: "Wind Speed", value: weatherData[0].input_features.wind_speed, icon: Wind },
    { label: "Rainfall", value: weatherData[0].input_features.rain_mm, icon: CloudRain },
    { label: "ET Value", value: weatherData[0].input_features.et_15min, icon: Gauge },
  ] : [];

  // Fix: Prevent SSR hydration mismatch for toLocaleTimeString
  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="space-y-6"
    >
      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-card-foreground mb-5">
          Farm Irrigation Control Panel
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_200px] gap-5">
          <div className="rounded-2xl bg-secondary/10 p-4 space-y-3">
            <h3 className="font-display text-sm font-bold text-secondary flex items-center gap-2">
              <CloudRain className="h-4 w-4" /> Weather Station
            </h3>
            {dynamicWeatherStation.length > 0 ? (
              dynamicWeatherStation.map((w) => (
                <div key={w.label} className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/15">
                    <w.icon className="h-3.5 w-3.5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{w.label}</p>
                    <p className="text-sm font-bold text-card-foreground">{w.value}</p>
                  </div>
                </div>
              ))
            ) : (
               <div className="text-xs text-muted-foreground">Loading weather...</div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {zones.length > 0 ? zones.map((zone) => (
              <div key={zone.name} className="rounded-2xl border-2 p-4">
                <h4 className="font-bold mb-2">{zone.name}</h4>
                <div className="text-sm mb-1">Soil Moisture: {zone.moisture}%</div>
                <div className="text-sm mb-1">Flow Rate: {zone.flowRate}</div>
                <div className="text-xs mb-2">🤖 {zone.aiRecommendation}</div>
                <button disabled className="w-full rounded-xl py-2 text-xs font-semibold bg-muted">
                  Valve: {zone.valveOpen ? "Open" : "Closed"}
                </button>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground col-span-3">Loading zones...</div>
            )}
          </div>

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
              {pumpOn ? "Stop " : "Start "}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-card">
        <h3 className="font-display text-md font-bold text-card-foreground mb-4 flex items-center gap-2">
          <History className="h-5 w-5" /> Recent AI Decisions
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Time</th>
                <th className="px-4 py-3">Soil Moisture</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Duration (s)</th>
                <th className="px-4 py-3 rounded-tr-lg">Predicted Next Moisture</th>
              </tr>
            </thead>
<tbody>
  {predictionHistory.length > 0 ? (
    predictionHistory.map((record) => (
      <tr key={record._id} className="border-b border-border/50 last:border-0">
        
        <td className="px-4 py-3 font-medium whitespace-nowrap">
          {new Date(
            record.timestamp.endsWith('Z') ? record.timestamp : `${record.timestamp}Z`
          ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </td>
        
        <td className="px-2 py-3">
          {record.input_features?.soil_moisture_current ?? "N/A"}%
        </td>
        
        <td className="px-2 py-3">
          <span className={`px-2 py-1 rounded text-xs font-bold ${record.decision?.action === "IRRIGATE" ? "bg-blue-500/20 text-blue-500" : "bg-gray-500/20 text-gray-500"}`}>
            {record.decision?.action || "NONE"}
          </span>
        </td>
        
        <td className="px-2 py-3">
          {record.decision?.recommended_valve_seconds !== undefined 
            ? `${record.decision.recommended_valve_seconds}s` 
            : "—"}
        </td>
        
        <td className="px-2 py-3">
          {record.model_output?.predicted_moisture 
            ? `${record.model_output.predicted_moisture.toFixed(1)}%` 
            : "N/A"}
        </td>
        
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
        No prediction history found.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default FarmControlPanel;