import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Droplet, Heart, HeartHandshake, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [, setLocation] = useLocation();
  const [donorCount, setDonorCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
        const response = await fetch(`${API_BASE}/dashboard/stats`);
        if (response.ok) {
          const data = await response.json();
          setDonorCount(data.completed || 0); 
        }
      } catch (error) {
        console.error("Error fetching hero stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full pt-0 overflow-hidden bg-gradient-to-b from-white to-gray-50/50 pb-24">
      
      {/* --- BACKGROUND DOODLES --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
         <Droplet className="absolute top-12 left-[10%] w-16 h-16 text-red-200/40 rotate-12" strokeWidth={1.5} />
         <Plus className="absolute top-32 left-[25%] w-8 h-8 text-red-300/30 -rotate-12" strokeWidth={2} />
         <Heart className="absolute top-20 right-[15%] w-20 h-20 text-red-200/30 -rotate-6" strokeWidth={1.5} />
         <Droplet className="absolute top-40 right-[30%] w-10 h-10 text-red-100/50 rotate-45" strokeWidth={2} />
         <HeartHandshake className="absolute top-1/2 left-[5%] -translate-y-1/2 w-24 h-24 text-red-100/40 rotate-12" strokeWidth={1} />
         <Plus className="absolute top-[60%] right-[10%] w-12 h-12 text-red-200/30 rotate-12" strokeWidth={1.5} />
         <Heart className="absolute bottom-20 left-[20%] w-14 h-14 text-red-200/40 -rotate-12" strokeWidth={1.5} />
         <Droplet className="absolute bottom-10 right-[25%] w-18 h-18 text-red-100/50 rotate-6" strokeWidth={1.5} />
         <Plus className="absolute bottom-32 left-[40%] w-6 h-6 text-red-300/30 rotate-45" strokeWidth={2} />
      </div>

      {/* --- STATS SECTION --- */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto min-h-[500px] flex flex-col justify-center items-center mt-12 md:mt-20">
        
        {/* LAYER B: THE LOGOS ("EARS")
            - Mobile: Flex row, gap for mickey ears, z-0 to sit behind face
            - Desktop: Absolute positioning to far sides
        */}
        <div className="
            relative z-0 flex justify-center gap-32 mb-[-50px] 
            md:absolute md:inset-0 md:justify-between md:px-[25%] md:items-center md:mb-0 md:gap-0 md:top-auto md:h-full pointer-events-none
        ">
              
          {/* Left Logo: Pictoreal */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="bg-white p-2 md:p-6 rounded-full shadow-xl shadow-red-900/10 border-4 border-red-50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300 pointer-events-auto flex-shrink-0"
          >
            <img 
              src="/Pictoreal.jpg.jpeg" 
              alt="Pictoreal Logo" 
              className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
            />
          </motion.div>

          {/* Right Logo: NSS */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.0, type: "spring" }}
            className="bg-white p-2 md:p-6 rounded-full shadow-xl shadow-red-900/10 border-4 border-red-50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300 pointer-events-auto flex-shrink-0"
          >
            <img 
              src="/Nss_logo.png" 
              alt="NSS Logo" 
              className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
            />
          </motion.div>
        </div>

        {/* LAYER C: TOTAL DONORS CIRCLE ("FACE") 
            - Z-index 20 to sit ON TOP of the ears
        */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-20 mb-10"
        >
          {/* Main Circle Card */}
          <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full shadow-[0_20px_50px_-10px_rgba(220,38,38,0.3)] flex flex-col items-center justify-center relative border-[8px] border-white ring-1 ring-gray-100">
            
            {/* Inner Dashed Ring Decoration */}
            <div className="absolute inset-3 rounded-full border-2 border-dashed border-red-100 opacity-60 animate-spin-slow" style={{ animationDuration: '20s' }} />
            
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900 font-display font-bold text-lg md:text-xl mb-2">
              Total Donors
            </h3>

            <div className="flex flex-col items-center">
              <span className="text-7xl md:text-8xl font-display font-bold text-gray-900 leading-none tracking-tighter">
                {loading ? (
                  <span className="text-red-200 animate-pulse">...</span>
                ) : (
                  <span className="text-red-600 drop-shadow-sm">{donorCount}</span>
                )}
              </span>
              
              
            </div>
            
            {/* Subtle Pulse Behind */}
            <div className="absolute -inset-1 rounded-full bg-red-50 -z-10 animate-pulse" />
          </div>
        </motion.div>

        {/* --- REGISTER BUTTON SECTION --- */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-4 z-20 px-4 text-center"
        >
            <p className="text-gray-500 font-medium text-base md:text-lg">
                If you want to donate blood, register here
            </p>
            <Button 
                size="lg" 
                className="bg-red-600 text-white hover:bg-red-700 h-12 px-8 text-lg font-semibold shadow-lg shadow-red-200 rounded-full transition-all hover:scale-105" 
                onClick={() => setLocation("/register")}
            >
                Register Now
            </Button>
        </motion.div>
        
      </div>

    </div>
  );
}