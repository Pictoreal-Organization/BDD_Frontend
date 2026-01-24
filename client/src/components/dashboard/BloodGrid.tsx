import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Droplet } from "lucide-react";

const bloodGroups = [
  { group: "A+", count: 24, target: 50, color: "bg-red-600" },
  { group: "A-", count: 8, target: 20, color: "bg-red-500" },
  { group: "B+", count: 32, target: 50, color: "bg-red-600" },
  { group: "B-", count: 12, target: 20, color: "bg-red-500" },
  { group: "AB+", count: 15, target: 25, color: "bg-red-400" },
  { group: "AB-", count: 4, target: 10, color: "bg-red-300" },
  { group: "O+", count: 45, target: 80, color: "bg-red-700" },
  { group: "O-", count: 18, target: 40, color: "bg-red-600" },
];

export function BloodGrid() {
  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <Droplet className="w-5 h-5 text-red-600" fill="currentColor" />
          </div>
          Blood Group Inventory
        </h2>
        
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bloodGroups.map((bg, idx) => (
          <motion.div
            key={bg.group}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-4 border-none shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center font-bold text-red-700 border border-red-100">
                  {bg.group}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold block leading-none">{bg.count}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Units</span>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round((bg.count / bg.target) * 100)}%</span>
                </div>
                <Progress value={(bg.count / bg.target) * 100} className="h-2 bg-red-50" indicatorClassName={bg.color} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
