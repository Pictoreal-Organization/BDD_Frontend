import { motion } from "framer-motion";
import { TrendingUp, HeartHandshake, Activity } from "lucide-react";

export function StatsRibbon() {
  return (
    <div className="relative w-full py-24 flex justify-center items-center overflow-hidden">
      
      {/* --- LAYER 1: The Infinite Ribbon (SVG Background) --- */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <svg 
          viewBox="0 0 800 300" 
          className="w-full max-w-5xl opacity-90"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradient to give the ribbon a 3D shiny red look */}
            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#991b1b" />   {/* Dark Red */}
              <stop offset="50%" stopColor="#ef4444" />   {/* Bright Red (Center) */}
              <stop offset="100%" stopColor="#991b1b" />  {/* Dark Red */}
            </linearGradient>
            
            {/* Drop shadow for the ribbon */}
            <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#7f1d1d" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* The Infinity Path (Thick Stroke) */}
          <motion.path
            d="M 200,150 C 200,50 350,50 400,150 C 450,250 600,250 600,150 C 600,50 450,50 400,150 C 350,250 200,250 200,150 Z"
            fill="none"
            stroke="url(#ribbonGradient)"
            strokeWidth="60"
            strokeLinecap="round"
            filter="url(#ribbonShadow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* --- LAYER 2: The Two Logos (Left & Right) --- */}
      <div className="absolute inset-0 max-w-5xl mx-auto flex items-center justify-between px-16 md:px-32 z-10 pointer-events-none">
        
        {/* Left Logo: Community/Care */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="bg-white p-4 rounded-full shadow-xl shadow-red-100 border-4 border-red-50"
        >
          <HeartHandshake className="w-12 h-12 text-red-600" />
        </motion.div>

        {/* Right Logo: Medical/Life */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="bg-white p-4 rounded-full shadow-xl shadow-red-100 border-4 border-red-50"
        >
          <Activity className="w-12 h-12 text-red-600" />
        </motion.div>
      </div>

      {/* --- LAYER 3: Center "Total Donors" Circle (On Top) --- */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-20"
      >
        {/* The Circular Card */}
        <div className="w-72 h-72 md:w-80 md:h-80 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center relative border-8 border-white">
          
          {/* Inner Glow/Ring */}
          <div className="absolute inset-2 rounded-full border border-red-100/50" />
          
          <h3 className="text-gray-500 text-lg font-medium uppercase tracking-wider mb-1">
            Total Donors
          </h3>

          <div className="flex flex-col items-center">
            <span className="text-7xl md:text-8xl font-display font-bold text-red-600 leading-none tracking-tighter">
              125
            </span>
            
            {/* Trend Indicator */}
            <span className="mt-4 flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
              <TrendingUp className="w-4 h-4" /> 
              +12%
            </span>
          </div>

          {/* Optional: Decorative pulsing ring behind the main circle */}
          <div className="absolute -inset-4 border-2 border-red-100 rounded-full -z-10 animate-pulse" />
        </div>
      </motion.div>

    </div>
  );
}