import { motion } from "framer-motion";
import { Droplet, Heart, Plus, Activity, BarChart3 } from "lucide-react";
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

  // List of ALL blood groups to ensure none are skipped
  const ALL_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Targets for each group (used for the progress bar visual)
  const targets: Record<string, number> = {
    "A+": 50, "A-": 20, 
    "B+": 50, "B-": 20,
    "AB+": 25, "AB-": 10, 
    "O+": 80, "O-": 40
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
        const response = await fetch(`${API_BASE}/dashboard/inventory`);
        
        if (!response.ok) throw new Error("Failed to fetch inventory");
        
        const data = await response.json();
        
        // Map over the FIXED list to ensure all 8 cards appear
        const transformedData: BloodGroupData[] = ALL_BLOOD_GROUPS.map(group => ({
          group,
          count: Number(data.bloodGroups?.[group] || 0),
          target: targets[group] || 50
        }));

        setInventory(transformedData);
      } catch (error) {
        console.error("Error loading inventory:", error);
        // Fallback data
        const fallbackData = ALL_BLOOD_GROUPS.map(group => ({
          group, 
          count: 0, 
          target: targets[group] || 50 
        }));
        setInventory(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
    const interval = setInterval(fetchInventory, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative bg-gradient-to-b from-red-50/50 to-white py-20 mb-12 border-y border-red-100 overflow-hidden"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      {/* --- BACKGROUND DOODLES --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-40">
         <Droplet className="absolute top-12 left-[5%] w-12 h-12 text-red-200/40 rotate-12" />
         <Plus className="absolute top-48 left-[15%] w-6 h-6 text-red-300/40 -rotate-12" />
         <Heart className="absolute bottom-20 left-[8%] w-16 h-16 text-red-200/30 -rotate-6" />
         <Activity className="absolute top-20 right-[10%] w-20 h-20 text-red-100/50 rotate-6" />
         <Droplet className="absolute bottom-32 right-[20%] w-10 h-10 text-red-200/40 rotate-45" />
         <Plus className="absolute top-10 right-[25%] w-8 h-8 text-red-200/40 rotate-45" />
         <Heart className="absolute top-[40%] left-[45%] w-24 h-24 text-red-50/20 rotate-12" />
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 md:px-8 relative z-10">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider mb-4"
            >
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                Live Inventory
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">Blood group Inventory</span>
            </h1>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">
                Real-time updates on blood availability by group. Help us meet our targets.
            </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4" />
                <div className="text-red-400 font-medium">Syncing Inventory...</div>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {inventory.map((bg, idx) => {
                const percentage = Math.min(Math.round((bg.count / bg.target) * 100), 100);
                // Determine color status based on percentage
                const isLow = percentage < 30;
                const progressColor = isLow ? "bg-red-400" : "bg-red-500";
                const textColor = isLow ? "text-red-600" : "text-red-600";
                const bgColor = isLow ? "bg-red-50" : "bg-red-50";

                return (
                <motion.div
                    key={bg.group}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    className="group relative flex flex-col justify-between bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(220,38,38,0.15)] hover:border-red-200 hover:-translate-y-1 transition-all duration-300"
                >
                    {/* Header: Icon & Label */}
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold font-display shadow-sm transition-colors duration-300 ${bgColor} ${textColor} group-hover:bg-red-600 group-hover:text-white`}>
                            {bg.group}
                        </div>
                        {isLow && (
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        )}
                    </div>

                    {/* Count */}
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                                {bg.count}
                            </span>
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide ml-1">
                                Donors
                            </span>
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