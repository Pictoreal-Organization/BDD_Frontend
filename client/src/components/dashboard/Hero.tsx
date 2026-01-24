import { motion } from "framer-motion";
import { Droplet, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import heroBg from "@assets/generated_images/abstract_modern_medical_background_with_soft_red_gradients_and_geometric_shapes.png";
import { Card } from "../ui/card";

export function Hero() {
  const [, setLocation] = useLocation();

  return (
   <div className="w-full mb-8">
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.1 }}
    className="w-full"
  >
    {/* 1. Removed 'p-8' from Card so the header touches the edges */}
    <Card className="relative overflow-hidden bg-white border-none shadow-xl h-full flex flex-col p-0">
      
      {/* 2. New Red Header Section */}
      <div className="bg-red-600 w-full py-4 flex items-center justify-center z-20">
        <h3 className="text-white text-3xl font-display font-bold uppercase tracking-wider">
          Total Donors
        </h3>
      </div>

      {/* 3. Main Content Area (Number) */}
      <div className="p-8 relative z-10 flex flex-col items-center justify-center flex-grow">

        <div className="relative z-10 flex flex-col items-center gap-2">
          <motion.span 
            className="text-7xl md:text-9xl font-display font-bold text-red-600"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            125
          </motion.span>
          
          {/* Trend Indicator (Optional) */}
          <span className="text-base font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1 mt-2">
             <TrendingUp className="w-4 h-4" /> +12%
          </span>
        </div>
      </div>
    </Card>
  </motion.div>
</div>
  );
}
