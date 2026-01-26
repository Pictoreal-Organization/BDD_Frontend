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
      className="relative bg-slate-50/50 py-16 mb-12"
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)"
      }}
    >
      {/* INNER CONTAINER FIX:
         1. 'translate-x-4' shifts everything slightly to the right. 
            (Change to translate-x-6 or translate-x-8 if you need more).
         2. 'max-w-7xl mx-auto' keeps it centered generally.
      */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-8 translate-x-4">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">
         
          
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Blood Group Inventory
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-base md:text-lg">
            Live monitoring of available blood units across all storage facilities.
          </p>
        </div>

        {/* Inventory Tubes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-x-8 gap-y-12 place-items-center w-full">
          {bloodGroups.map((bg, idx) => {
            const percentage = Math.min(Math.round((bg.count / bg.target) * 100), 100);
            
            return (
              <motion.div
                key={bg.group}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center group cursor-pointer w-full max-w-[120px]"
              >
                {/* Top Label: Count */}
                <div className="mb-3 text-center transition-transform duration-300 group-hover:-translate-y-1">
                  <span className="text-2xl font-bold text-gray-800 block leading-none">
                    {bg.count}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 block">
                    Units
                  </span>
                </div>

                {/* Glass Tube Container */}
                <div className="relative w-14 h-36 bg-white rounded-full border-2 border-slate-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
                  
                  {/* Glossy Reflection Overlay */}
                  <div className="absolute inset-0 z-30 w-full h-full rounded-full bg-gradient-to-r from-white/80 via-white/20 to-transparent pointer-events-none opacity-50" />
                  
                  {/* Dashed Target Line (at 75%) */}
                  <div className="absolute top-[25%] left-0 w-full h-[1px] bg-slate-200 z-0 dashed" />

                  {/* Liquid Fill Animation */}
                  <motion.div
                    initial={{ height: "0%" }}
                    whileInView={{ height: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    className={`absolute bottom-0 w-full z-10 rounded-t-lg bg-gradient-to-t ${
                      percentage < 30 ? 'from-amber-500 to-amber-400' : 'from-red-600 to-red-500'
                    } shadow-[0_0_20px_rgba(220,38,38,0.4)]`}
                  >
                      <div className="w-full h-1.5 bg-white/40 absolute top-0 blur-[1px]" />
                      
                      {/* Rising Bubbles Effect */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                          <motion.div 
                            key={i}
                            className="absolute bg-white/30 rounded-full"
                            style={{
                              width: Math.random() * 4 + 2 + 'px',
                              height: Math.random() * 4 + 2 + 'px',
                              left: Math.random() * 100 + '%',
                            }}
                            animate={{ y: [0, -100], opacity: [0, 1, 0] }}
                            transition={{ 
                              duration: Math.random() * 2 + 2, 
                              repeat: Infinity, 
                              delay: Math.random() * 2,
                              ease: "linear"
                            }}
                          />
                        ))}
                      </div>
                  </motion.div>
                </div>

                {/* Bottom Label: Blood Group Badge */}
                <div className="mt-4 relative">
                   <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                      <span className="font-display font-bold text-lg text-gray-800">
                        {bg.group}
                      </span>
                   </div>
                </div>

                {/* Tooltip */}
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-6">
                   <span className={`text-[10px] font-bold ${percentage < 30 ? 'text-amber-500' : 'text-green-600'} whitespace-nowrap`}>
                      {percentage}% Full
                   </span>
                </div>
                
              </motion.div>
            );
          })}
        </div>
        
        {/* Bottom Button */}
        <div className="mt-16 text-center">
            <button className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-0.5">
                View Detailed Analytics
            </button>
        </div>
      </div>
    </div>
  );
}