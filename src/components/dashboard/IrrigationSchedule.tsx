import { motion } from "framer-motion";
import { Clock, Timer } from "lucide-react";

type Status = "Completed" | "Running" | "Scheduled";

interface ScheduleItem {
  node: string;
  field: string;
  startTime: string;
  duration: string;
  status: Status;
}

const schedule: ScheduleItem[] = [
  { node: "Node 1", field: "Field A", startTime: "06:00 AM", duration: "45 min", status: "Completed" },
  { node: "Node 2", field: "Field B", startTime: "08:30 AM", duration: "30 min", status: "Running" },
  { node: "Node 3", field: "Greenhouse", startTime: "11:00 AM", duration: "20 min", status: "Scheduled" },
];

const statusStyles: Record<Status, string> = {
  Completed: "bg-accent text-accent-foreground",
  Running: "bg-secondary/15 text-secondary",
  Scheduled: "bg-aqua-orange/15 text-aqua-orange",
};

const IrrigationSchedule = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-card p-6 shadow-card"
    >
      <h2 className="font-display text-lg font-bold text-card-foreground mb-4">
        Irrigation Scheduling
      </h2>

      <div className="space-y-3">
        {schedule.map((item, i) => (
          <motion.div
            key={item.node}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center justify-between rounded-xl bg-muted/50 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <span className="text-xs font-bold text-primary-foreground">{item.node.split(" ")[1]}</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-card-foreground">{item.node} – {item.field}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.startTime}</span>
                  <span className="flex items-center gap-1"><Timer className="h-3 w-3" />{item.duration}</span>
                </div>
              </div>
            </div>

            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default IrrigationSchedule;
