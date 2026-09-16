import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
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
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden mb-12 shadow-2xl">
      
      {/* --- REAL BACKGROUND IMAGE --- */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('/BDD_image.jpeg')`,
          backgroundAttachment: "fixed",
          filter: "blur(8px)",
          transform: "scale(1.05)"
        }}
      />
      
      {/* --- DARK OVERLAY --- */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 py-12 text-center flex flex-col items-center">
        
        {/* Logos */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center gap-6 mb-8"
        >
          <img 
            src="/Pictoreal.jpg.jpeg" 
            alt="Pictoreal Logo" 
            className="w-16 h-16 md:w-24 md:h-24 rounded-full shadow-lg object-cover border-4 border-white"
          />
          <span className="text-white/60 font-bold text-xl px-2">✕</span>
          <img 
            src="/Nss_logo.png" 
            alt="NSS Logo" 
            className="w-16 h-16 md:w-24 md:h-24 rounded-full shadow-lg object-cover border-4 border-white bg-white"
          />
        </motion.div>

        {/* Hero Text */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] mb-6 drop-shadow-md">
            Donate Blood,
            <span className="text-red-500"> Save a Life Today.</span>
          </h1>
          
          {/* <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 font-light">
            Join the Blood Donation Drive on <strong className="text-white font-bold">5th February 2026</strong> at A3 006 BCR.
          </p> */}
        </motion.div>

        {/* --- MASSIVE LIVE COUNTER --- */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12 bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-lg mx-auto shadow-xl"
        >
          <h3 className="text-red-400 font-display font-bold text-lg md:text-2xl tracking-widest uppercase mb-3">
            Total Donors
          </h3>
          <div className="text-6xl md:text-[110px] font-display font-bold text-white leading-none tracking-tighter drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            {loading ? (
              <span className="animate-pulse opacity-50">...</span>
            ) : (
              <span>{donorCount}</span>
            )}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button 
            size="lg" 
            className="bg-red-600 text-white hover:bg-red-700 h-16 px-12 text-xl font-bold shadow-[0_0_40px_rgba(220,38,38,0.4)] rounded-full transition-transform hover:scale-105"
            onClick={() => setLocation("/register")}
          >
            Register Now
            <Heart className="w-6 h-6 ml-3 fill-current" />
          </Button>
        </motion.div>

      </div>
    </div>
  );
}