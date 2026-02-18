import { motion } from "framer-motion";
import { Brain, AlertTriangle, Eye, CheckCircle2 } from "lucide-react";

interface Decision {
  field: string;
  action: string;
  reason: string;
  timestamp: string;
  type: "recommended" | "skip" | "monitor";
}

const decisions: Decision[] = [
  {
    field: "Field A",
    action: "Irrigation Recommended",
    reason: "Low soil moisture + High evapotranspiration rate",
    timestamp: "10 min ago",
    type: "recommended",
  },
  {
    field: "Field B",
    action: "Skip Irrigation",
    reason: "Rain expected in 2 hours – probability 85%",
    timestamp: "25 min ago",
    type: "skip",
  },
  {
    field: "Field C",
    action: "Monitor Only",
    reason: "Soil moisture within optimal range, stable forecast",
    timestamp: "1 hour ago",
    type: "monitor",
  },
];

const typeConfig = {
  recommended: { icon: CheckCircle2, color: "text-primary" },
  skip: { icon: AlertTriangle, color: "text-aqua-orange" },
  monitor: { icon: Eye, color: "text-secondary" },
};

const AIDecisionPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl gradient-dark p-6 shadow-elevated"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20">
            <Brain className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="font-display text-lg font-bold text-aqua-dark-foreground">
            AI Irrigation Decisions
          </h2>
        </div>
        <div className="rounded-xl bg-primary/15 px-4 py-2">
          <p className="text-xs text-aqua-dark-foreground/70">System Efficiency</p>
          <p className="text-lg font-bold text-primary">92%</p>
        </div>
      </div>

      <div className="space-y-3">
        {decisions.map((d, i) => {
          const config = typeConfig[d.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={d.field}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-start gap-4 rounded-xl bg-aqua-dark-surface/60 p-4"
            >
              <div className={`mt-0.5 ${config.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-aqua-dark-foreground">
                    {d.field} – {d.action}
                  </p>
                  <span className="text-xs text-aqua-dark-foreground/50 whitespace-nowrap ml-2">{d.timestamp}</span>
                </div>
                <p className="text-xs text-aqua-dark-foreground/60 mt-0.5">{d.reason}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AIDecisionPanel;
