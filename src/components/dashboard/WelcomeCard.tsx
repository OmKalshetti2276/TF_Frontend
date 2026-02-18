import { motion } from "framer-motion";
import { Droplet, CloudRain, Gauge, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { label: "Soil Moisture Avg", value: "62%", change: "+3%", positive: true, icon: Droplet },
  { label: "Water Used", value: "1,240L", change: "-8%", positive: true, icon: Gauge },
  { label: "Rainfall Forecast", value: "18mm", change: "+12%", positive: true, icon: CloudRain },
  { label: "Irrigation Efficiency", value: "92%", change: "+15%", positive: true, icon: TrendingUp },
];

const WelcomeCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl gradient-hero p-6 sm:p-8 shadow-elevated"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left */}
        <div className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
            Welcome back, Farmer 🌿
          </h1>
          <p className="text-primary-foreground/80 text-sm sm:text-base max-w-md">
            Smart Irrigation insights for your field – Last 7 days
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-card hover:opacity-90 transition-opacity">
            View Full Stats
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Right: Stat cards */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-xl bg-card/90 backdrop-blur-sm p-3.5 shadow-card min-w-[140px]"
            >
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="h-4 w-4 text-primary" />
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${
                  stat.positive ? "text-primary" : "text-destructive"
                }`}>
                  {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-lg font-bold text-card-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;
