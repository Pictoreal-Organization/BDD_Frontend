import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import heroBg from "@assets/generated_images/abstract_modern_medical_background_with_soft_red_gradients_and_geometric_shapes.png";

export function Hero() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-3xl shadow-2xl mb-8 group">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-red-800/80 to-transparent" />

      {/* Content */}
      <div className="relative h-full container mx-auto px-8 flex flex-col justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
              <Droplet className="w-6 h-6 text-red-200 animate-pulse" fill="currentColor" />
            </div>
            <span className="font-semibold tracking-wide uppercase text-sm text-red-100">Official Drive 2025</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
            Blood Donation <br />
            <span className="text-red-200">Drive 2025</span>
          </h1>

          <p className="text-xl text-red-100 font-light max-w-lg">
            Join our mission to save lives. Your single donation can save up to three lives. Be a hero today.
          </p>

          <div className="flex gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-white text-red-600 hover:bg-red-50 font-semibold h-12 px-8 rounded-full shadow-lg transition-all hover:scale-105"
              onClick={() => setLocation("/register")}
            >
              Register to Donate
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8 rounded-full backdrop-blur-sm">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Animated Blood Drop */}
      <motion.div 
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-10 right-10 md:right-32 opacity-20 hidden md:block"
      >
        <Droplet className="w-64 h-64 text-white" fill="currentColor" />
      </motion.div>
    </div>
  );
}
