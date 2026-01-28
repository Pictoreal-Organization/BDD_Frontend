import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export function Hero() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative w-full pt-6 md:pt-10 overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
    

      {/* 2. STATS VISUALIZATION (Ribbon Removed) */}
      <div className="relative w-full max-w-[1400px] mx-auto h-[350px] md:h-[450px] flex justify-center items-center mt-0">
        
        {/* --- LAYER A: (Ribbon SVG Removed) --- */}

        {/* --- LAYER B: The Two Logos (Left & Right) --- */}
        <div className="absolute inset-0 w-full flex items-center justify-between px-[5%] md:px-[10%] lg:px-[18%] z-10 pointer-events-none">
              
          {/* Left Logo: Pictoreal */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="bg-white p-4 md:p-6 rounded-full shadow-2xl shadow-red-900/20 border-4 border-red-50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
          >
            <img 
              src="/Pictoreal.jpg.jpeg" 
              alt="Pictoreal Logo" 
              className="w-16 h-16 md:w-32 md:h-32 rounded-full object-cover"
            />
          </motion.div>

          {/* Right Logo: NSS */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.0, type: "spring" }}
            className="bg-white p-4 md:p-6 rounded-full shadow-2xl shadow-red-900/20 border-4 border-red-50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
          >
            <img 
              src="/NSS.jpg.jpeg" 
              alt="NSS Logo" 
              className="w-16 h-16 md:w-32 md:h-32 rounded-full object-cover"
            />
          </motion.div>
        </div>

        {/* --- LAYER C: Center "Total Donors" Circle (Floating on Top) --- */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-20"
        >
          {/* Main Circle Card */}
          <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full shadow-[0_20px_50px_-10px_rgba(220,38,38,0.3)] flex flex-col items-center justify-center relative border-[8px] border-white ring-1 ring-gray-100">
            
            {/* Inner Dashed Ring Decoration */}
            <div className="absolute inset-3 rounded-full border-2 border-dashed border-red-100 opacity-60 animate-spin-slow" style={{ animationDuration: '20s' }} />
            
            <h3 className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-3">
              Total Donors
            </h3>

            <div className="flex flex-col items-center">
              <span className="text-7xl md:text-8xl font-display font-bold text-gray-900 leading-none tracking-tighter">
                <span className="text-red-600 drop-shadow-sm">125</span>
              </span>
              
              {/* Trend Pill */}
              <span className="mt-4 flex items-center gap-1.5 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-green-100">
                <TrendingUp className="w-4 h-4" /> 
                <span>+12% this week</span>
              </span>
            </div>
            
            {/* Subtle Pulse Behind */}
            <div className="absolute -inset-1 rounded-full bg-red-50 -z-10 animate-pulse" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}