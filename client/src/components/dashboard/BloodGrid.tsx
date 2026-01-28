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
  const bloodGroups = [
    { group: "A+", count: 24, target: 50 },
    { group: "A-", count: 8, target: 20 },
    { group: "B+", count: 32, target: 50 },
    { group: "B-", count: 12, target: 20 },
    { group: "AB+", count: 15, target: 25 },
    { group: "AB-", count: 4, target: 10 },
    { group: "O+", count: 45, target: 80 },
    { group: "O-", count: 18, target: 40 },
  ];

  return (
    // Outer Wrapper: Forces full width background
    <div 
      className="relative bg-slate-50/30 py-16 mb-12 border-y border-slate-100"
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)"
      }}
    >
      <div className="max-w-7xl w-full mx-auto px-6 md:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Blood Group Inventory
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base">
            Live monitoring of available blood units across all storage facilities.
          </p>
        </div>

        {/* RECTANGULAR GRID CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bloodGroups.map((bg, idx) => {
            const percentage = Math.min(Math.round((bg.count / bg.target) * 100), 100);
            const isLow = percentage < 30;
            
            return (
              <motion.div
                key={bg.group}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Header: Group & Status */}
                <div className="flex justify-between items-start mb-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold font-display shadow-sm transition-colors duration-300 ${isLow ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'}`}>
                     {bg.group}
                   </div>
                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isLow ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                     {isLow ? 'Low Stock' : 'Optimal'}
                   </span>
                </div>

                {/* Card Body: Count */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">{bg.count}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Units</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Target: {bg.target}</p>
                </div>

                {/* Card Footer: Progress Bar */}
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      <span>Capacity</span>
                      <span className={isLow ? 'text-amber-600' : 'text-green-600'}>{percentage}%</span>
                   </div>
                   <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className={`absolute top-0 left-0 h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-red-600'}`}
                      />
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Bottom Button */}
        <div className="mt-12 text-center">
            <button className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-0.5">
                View Detailed Analytics
            </button>
        </div>
      </div>
    </div>
  );
}