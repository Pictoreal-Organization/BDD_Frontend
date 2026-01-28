import { motion } from "framer-motion";
import { Droplet, Heart, Plus, Activity, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

// Define the shape of our data
interface BloodGroupData {
  group: string;
  count: number;
  target: number;
}

export function BloodGrid() {
  const [inventory, setInventory] = useState<BloodGroupData[]>([]);
  const [loading, setLoading] = useState(true);

  // Targets can be hardcoded or fetched from settings if you add that later
  const targets: Record<string, number> = {
    "A+": 50, "A-": 20, "B+": 50, "B-": 20,
    "AB+": 25, "AB-": 10, "O+": 80, "O-": 40
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
        const response = await fetch(`${API_BASE}/dashboard/inventory`);
        
        if (!response.ok) throw new Error("Failed to fetch inventory");
        
        const data = await response.json();
        // data.bloodGroups looks like { "A+": 0, "B+": 0 ... }
        
        // Transform backend object into frontend array
        const transformedData: BloodGroupData[] = Object.entries(data.bloodGroups || {}).map(([group, count]) => ({
          group,
          count: Number(count),
          target: targets[group] || 50
        }));

        setInventory(transformedData);
      } catch (error) {
        console.error("Error loading inventory:", error);
        // Fallback mock data in case of error
        setInventory([
            { group: "A+", count: 0, target: 50 },
            { group: "B+", count: 0, target: 50 },
            { group: "O+", count: 0, target: 50 },
            { group: "AB+", count: 0, target: 50 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
    // Refresh every 30 seconds
    const interval = setInterval(fetchInventory, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative bg-slate-50/30 py-16 mb-12 border-y border-slate-100 overflow-hidden"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      {/* --- BACKGROUND DOODLES (Unchanged) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
         <Droplet className="absolute top-12 left-[5%] w-12 h-12 text-red-200/20 rotate-12" />
         <Plus className="absolute top-48 left-[15%] w-6 h-6 text-red-300/20 -rotate-12" />
         <Heart className="absolute bottom-20 left-[8%] w-16 h-16 text-red-200/10 -rotate-6" />
         <Activity className="absolute top-20 right-[10%] w-20 h-20 text-red-100/30 rotate-6" />
         <Droplet className="absolute bottom-32 right-[20%] w-10 h-10 text-red-200/20 rotate-45" />
         <Plus className="absolute top-10 right-[25%] w-8 h-8 text-red-200/20 rotate-45" />
         <Heart className="absolute top-[40%] left-[45%] w-24 h-24 text-red-50/50 rotate-12" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 md:px-8 relative z-10">
        
        <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-[1.1] mb-16 tracking-tight text-center">
                Blood Group Inventory <br className="hidden md:block" />
            </h1>
        </div>

        {/* LOADING STATE */}
        {loading ? (
            <div className="text-center py-10 text-gray-400">Loading Inventory...</div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {inventory.map((bg, idx) => {
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
                    <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold font-display shadow-sm transition-colors duration-300 ${isLow ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'}`}>
                        {bg.group}
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isLow ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        {isLow ? 'Low Stock' : 'Optimal'}
                    </span>
                    </div>

                    <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-bold text-gray-900 tracking-tight">{bg.count}</span>
                        <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Units</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
                        <div className={`p-1.5 rounded-full ${isLow ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                            <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-sm font-bold ${isLow ? 'text-amber-600' : 'text-green-600'}`}>
                            {percentage}% 
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">of target</span>
                    </div>
                    </div>
                </motion.div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
}