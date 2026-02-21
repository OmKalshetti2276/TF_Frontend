import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { getHistory } from "@/services/api";

const SoilWaterAnalytics = () => {
  const [history, setHistory] = useState<any>({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error("History error:", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);

    return () => clearInterval(interval);
  }, []);

  // 🔹 Convert backend history to chart format (Zone A example)
  const moistureData =
    history["Zone B"]?.map((point: any) => ({
      time: new Date(point.timestamp * 1000).toLocaleTimeString(),
      current: point.moisture,
      target: 65, // fixed target for visualization
    })) || [];

  const waterData =
    history["Zone B"]?.map((point: any) => ({
      time: new Date(point.timestamp * 1000).toLocaleTimeString(),
      usage: point.flow_rate,
    })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Soil Moisture Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-card p-6 shadow-card"
      >
        <h2 className="font-display text-lg font-bold text-card-foreground mb-4">
          Soil Moisture Trend
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={moistureData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(220 18% 90%)"
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: "hsl(220 15% 50%)" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(220 15% 50%)" }}
              domain={[20, 80]}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Legend iconType="circle" iconSize={8} />
            <Line
              type="monotone"
              dataKey="current"
              stroke="hsl(152 55% 42%)"
              strokeWidth={2.5}
              dot={false}
              name="Current Moisture"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="hsl(210 60% 52%)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              name="Target Moisture"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Water Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-card p-6 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-card-foreground">
            Water Usage
          </h2>
          <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <TrendingUp className="h-3 w-3" /> Live
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={waterData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(220 18% 90%)"
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: "hsl(220 15% 50%)" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(220 15% 50%)" }}
              unit="L"
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 20px -4px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="usage"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              name="Water (L)"
            />
            <defs>
              <linearGradient
                id="barGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(152 55% 42%)"
                />
                <stop
                  offset="100%"
                  stopColor="hsl(210 60% 52%)"
                />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default SoilWaterAnalytics;