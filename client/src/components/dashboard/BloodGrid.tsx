import { motion } from "framer-motion";
import { Droplet, Heart, Plus, Activity, TrendingUp } from "lucide-react";

export function BloodGrid() {
  // Mock Data
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
    <div 
      className="relative bg-slate-50/30 py-16 mb-12 border-y border-slate-100 overflow-hidden"
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)"
      }}
    >
      {/* --- BACKGROUND DOODLES SECTION --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
         {/* Left Side */}
         <Droplet className="absolute top-12 left-[5%] w-12 h-12 text-red-200/20 rotate-12" />
         <Plus className="absolute top-48 left-[15%] w-6 h-6 text-red-300/20 -rotate-12" />
         <Heart className="absolute bottom-20 left-[8%] w-16 h-16 text-red-200/10 -rotate-6" />
         
         {/* Right Side */}
         <Activity className="absolute top-20 right-[10%] w-20 h-20 text-red-100/30 rotate-6" />
         <Droplet className="absolute bottom-32 right-[20%] w-10 h-10 text-red-200/20 rotate-45" />
         <Plus className="absolute top-10 right-[25%] w-8 h-8 text-red-200/20 rotate-45" />
         
         {/* Center/Random */}
         <Heart className="absolute top-[40%] left-[45%] w-24 h-24 text-red-50/50 rotate-12" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 md:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-[1.1] mb-16 tracking-tight text-center">
                Blood Group Inventory <br className="hidden md:block" />
            </h1>
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
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Header: Group & Status */}
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold font-display shadow-sm transition-colors duration-300 ${isLow ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'}`}>
                     {bg.group}
                   </div>
                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isLow ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                     {isLow ? 'Low Stock' : 'Optimal'}
                   </span>
                </div>

                {/* Card Body: Count & Percentage */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold text-gray-900 tracking-tight">{bg.count}</span>
                    <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Units</span>
                  </div>
                  
                  {/* Percentage Display */}
                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
                      <div className={`p-1.5 rounded-full ${isLow ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                         <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-sm font-bold ${isLow ? 'text-amber-600' : 'text-green-600'}`}>
                        {percentage}% 
                      </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}