import { motion } from "framer-motion";
import { Thermometer, CloudRain, Droplets, Wifi, WifiOff, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";

const nodes = [
  { name: "Node 1 – Field A", online: true },
  { name: "Node 2 – Field B", online: true },
  { name: "Node 3 – Greenhouse", online: false },
];

const WeatherAndControls = () => {
  const [autoMode, setAutoMode] = useState(true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Weather Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-card p-6 shadow-card"
      >
        <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Weather Preview</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <Thermometer className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-lg font-bold text-card-foreground">28°C</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
              <CloudRain className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rain Forecast</p>
              <p className="text-lg font-bold text-card-foreground">65% in 3h</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <Droplets className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-lg font-bold text-card-foreground">72%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Irrigation Mode */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl bg-card p-6 shadow-card"
      >
        <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Irrigation Mode</h3>
        <button
          onClick={() => setAutoMode(!autoMode)}
          className="flex items-center justify-between w-full rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"
        >
          <div>
            <p className="font-semibold text-sm text-card-foreground">
              {autoMode ? "Automatic Mode" : "Manual Mode"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {autoMode ? "AI controls irrigation schedule" : "Manual override active"}
            </p>
          </div>
          {autoMode ? (
            <ToggleRight className="h-8 w-8 text-primary" />
          ) : (
            <ToggleLeft className="h-8 w-8 text-muted-foreground" />
          )}
        </button>

        <div className="mt-4 rounded-xl p-4 gradient-primary">
          <p className="text-xs text-primary-foreground/80">Current Status</p>
          <p className="text-lg font-bold text-primary-foreground">
            {autoMode ? "AI Active 🤖" : "Manual Control ✋"}
          </p>
        </div>
      </motion.div>

      {/* Node Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl bg-card p-6 shadow-card"
      >
        <h3 className="font-display text-lg font-bold text-card-foreground mb-4">Node Status</h3>
        <div className="space-y-3">
          {nodes.map((node) => (
            <div
              key={node.name}
              className="flex items-center justify-between rounded-xl bg-muted/50 p-3.5"
            >
              <div className="flex items-center gap-3">
                {node.online ? (
                  <Wifi className="h-4 w-4 text-primary" />
                ) : (
                  <WifiOff className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm font-medium text-card-foreground">{node.name}</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  node.online
                    ? "bg-accent text-accent-foreground"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {node.online ? "Online" : "Offline"}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherAndControls;
