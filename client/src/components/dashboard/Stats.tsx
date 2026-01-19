import { motion } from "framer-motion";
import { Users, Heart, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Donors Card - Main Featured Stat */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 relative overflow-hidden bg-white border-none shadow-xl h-full flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Users className="w-32 h-32 text-red-600" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-muted-foreground font-medium mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Total Donors
            </h3>
            <div className="flex items-baseline gap-2">
              <motion.span 
                className="text-6xl font-display font-bold text-red-600"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                125
              </motion.span>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12%
              </span>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Target: 500 donors by month end
          </div>
        </Card>
      </motion.div>

      {/* Lives Saved Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-xl h-full flex flex-col justify-between">
          <div>
            <h3 className="text-red-100 font-medium mb-1 flex items-center gap-2">
              <Heart className="w-4 h-4 fill-white/20" />
              Lives Saved Today
            </h3>
            <div className="text-5xl font-display font-bold">45</div>
          </div>
          <div className="mt-4 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs text-red-50">"Every drop counts towards saving a life."</p>
          </div>
        </Card>
      </motion.div>

      {/* Last Updated Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-white border-none shadow-xl h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50" />
          <div className="relative z-10 space-y-2">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-muted-foreground font-medium">Last Updated</h3>
            <p className="text-2xl font-semibold">2 mins ago</p>
            <p className="text-xs text-muted-foreground">Live data from collection centers</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
