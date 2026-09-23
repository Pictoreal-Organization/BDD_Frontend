import { useState, useEffect } from "react";
import { User, X, Droplet, Heart, HeartHandshake, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FlipClock } from "./FlipClock";

export function Hero() {
  const [, setLocation] = useLocation();
  const [donorCount, setDonorCount] = useState<number>(0);
  const [latestDonor, setLatestDonor] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
        const cleanBase = API_BASE.replace(/\/$/, ""); 

        // Fetch stats
        const statsRes = await fetch(`${cleanBase}/dashboard/stats`);
        if (statsRes.ok) {
          const data = await statsRes.json();
          setDonorCount(data.completed || 0); 
        }

        // Fetch recent donors
        const recentRes = await fetch(`${cleanBase}/recent`);
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          if (Array.isArray(recentData) && recentData.length > 0) {
            setLatestDonor(recentData[0].name);
          } else {
            setLatestDonor("Be the first!");
          }
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full pt-10 pb-16 overflow-hidden bg-gradient-to-b from-white to-gray-50/50 flex flex-col items-center justify-center min-h-[70vh]">
      
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

      <div className="relative z-10 flex flex-col items-center justify-center w-full mt-8">
        
        {/* Collaboration Section */}
        <div className="flex items-center gap-6 mb-12">
          <div className="bg-white p-2 rounded-full shadow-md border border-gray-100 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 relative z-10">
            <img 
              src="/Pictoreal.jpg.jpeg" 
              alt="Pictoreal Logo" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <X className="w-8 h-8 text-gray-300 relative z-10" strokeWidth={3} />
          <div className="bg-white p-2 rounded-full shadow-md border border-gray-100 flex items-center justify-center w-24 h-24 md:w-32 md:h-32 relative z-10">
            <img 
              src="/Nss_logo.png" 
              alt="NSS Logo" 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-display font-medium text-gray-800 mb-8 tracking-tight relative z-10">
          Total Donors
        </h2>

        {/* Donor Count Visualization (Flip Clock) */}
        <div className="mb-10 relative z-10">
          {loading ? (
            <div className="h-24 md:h-32 flex items-center justify-center">
              <span className="text-gray-400 animate-pulse text-2xl font-medium">Loading...</span>
            </div>
          ) : (
            <FlipClock count={donorCount} />
          )}
        </div>

        {/* Subtitle */}
        <h3 className="text-sm md:text-base font-bold text-black tracking-[0.2em] mb-12 uppercase relative z-10 text-center px-4">
          Together for a healthier life
        </h3>

        {/* Recent Donor Feature */}
        <div className="flex items-center bg-white rounded-full p-2 pr-6 md:pr-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative z-10">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-full flex items-center justify-center text-white mr-4 shadow-sm flex-shrink-0">
            <User size={24} />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Latest Donor</span>
            <span className="text-lg md:text-xl font-bold text-red-600 leading-tight">{latestDonor}</span>
            <span className="text-xs md:text-sm text-gray-500 flex items-center mt-0.5">
              Just Donated Blood <span className="ml-1 text-red-500 text-xs">❤️</span>
            </span>
          </div>
        </div>
        
        {/* Register Now Button */}
        {/* <div className="flex flex-col items-center gap-4 z-20 px-4 text-center mt-12 relative z-10">
            <Button 
                size="lg" 
                className="bg-red-600 text-white hover:bg-red-700 h-12 px-8 text-lg font-semibold shadow-lg shadow-red-200 rounded-full transition-all hover:scale-105" 
                onClick={() => setLocation("/register")}
            >
                Register Now
            </Button>
        </div> */}

      </div>
    </div>
  );
}