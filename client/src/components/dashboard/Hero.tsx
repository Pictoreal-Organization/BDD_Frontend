import { motion } from "framer-motion";
import { TrendingUp, Droplet, Heart, HeartHandshake, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative w-full pt-6 md:pt-10 overflow-hidden bg-gradient-to-b from-white to-gray-50/50 pb-16">
      
      {/* --- BACKGROUND DOODLES SECTION --- */}
      {/* This layer sits absolutely behind everything with low opacity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
         {/* Top Left Area */}
         <Droplet className="absolute top-12 left-[10%] w-16 h-16 text-red-200/40 rotate-12" strokeWidth={1.5} />
         <Plus className="absolute top-32 left-[25%] w-8 h-8 text-red-300/30 -rotate-12" strokeWidth={2} />
         
         {/* Top Right Area */}
         <Heart className="absolute top-20 right-[15%] w-20 h-20 text-red-200/30 -rotate-6" strokeWidth={1.5} />
         <Droplet className="absolute top-40 right-[30%] w-10 h-10 text-red-100/50 rotate-45" strokeWidth={2} />
         
         {/* Middle Area */}
         <HeartHandshake className="absolute top-1/2 left-[5%] -translate-y-1/2 w-24 h-24 text-red-100/40 rotate-12" strokeWidth={1} />
         <Plus className="absolute top-[60%] right-[10%] w-12 h-12 text-red-200/30 rotate-12" strokeWidth={1.5} />
         
         {/* Bottom Area */}
         <Heart className="absolute bottom-20 left-[20%] w-14 h-14 text-red-200/40 -rotate-12" strokeWidth={1.5} />
         <Droplet className="absolute bottom-10 right-[25%] w-18 h-18 text-red-100/50 rotate-6" strokeWidth={1.5} />
         <Plus className="absolute bottom-32 left-[40%] w-6 h-6 text-red-300/30 rotate-45" strokeWidth={2} />
      </div>


      {/* 1. HERO TEXT SECTION (Relative z-20 to sit on top of doodles) */}
      <div className="container mx-auto px-4 relative z-20 text-center mb-4 md:mb-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display mt-10 font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Donate Blood, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
              Save a Life Today.
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
            Join the Blood Donation Drive at A3 building, room GCR, and save a life today. Your small act of kindness can make a huge difference.
          </p>
        </motion.div>
      </div>
       <div className="flex justify-center w-full mt-8 relative z-30"> 
        <Button 
          size="lg" 
          // INCREASED SIZE: h-14, px-10, text-lg
          className="bg-red-600 text-white hover:bg-red-700 h-14 px-10 text-lg font-semibold shadow-xl shadow-red-200 whitespace-nowrap"
          onClick={() => setLocation("/register")}
        >
          Register Now
        </Button>
      </div>
   
      {/* 2. STATS VISUALIZATION Section (Relative z-10 to sit on top) */}
   <div className="relative z-10 w-full max-w-[1400px] mx-auto h-[350px] md:h-[450px] flex justify-center items-center mt-25">
        
        {/* --- LAYER B: The Two Logos (Left & Right) --- */}
        <div className="absolute inset-0 w-full flex items-center justify-between px-[5%] md:px-[10%] lg:px-[18%] z-10 pointer-events-none">
              
          {/* Left Logo: Pictoreal */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="bg-white p-4 md:p-6 rounded-full shadow-2xl shadow-red-900/20 border-4 border-red-50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300 pointer-events-auto"
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
            className="bg-white p-4 md:p-6 rounded-full shadow-2xl shadow-red-900/20 border-4 border-red-50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300 pointer-events-auto"
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
              <span className="mt-4 flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-green-100 bg-white">
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