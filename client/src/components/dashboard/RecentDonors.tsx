import { motion, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Clock, User, Droplet, Heart, Plus, Activity, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock data generator
const names = ["Sarah M.", "James Wilson", "Anita Raj", "Michael Chen", "David K.", "Elena R.", "Tom H."];
const groups = ["O+", "A+", "B-", "AB+", "O-", "A-"];

interface Donation {
  id: number;
  name: string;
  group: string;
  time: string;
  timestamp: number;
}

export function RecentDonors() {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([
    { id: 1, name: "Sarah Jenkins", group: "O+", time: "2 mins ago", timestamp: Date.now() },
    { id: 2, name: "Mike Ross", group: "A-", time: "5 mins ago", timestamp: Date.now() - 300000 },
    { id: 3, name: "Jessica P.", group: "B+", time: "12 mins ago", timestamp: Date.now() - 720000 },
    { id: 4, name: "Harvey S.", group: "O+", time: "15 mins ago", timestamp: Date.now() - 900000 },
    { id: 5, name: "Louis Litt", group: "AB+", time: "28 mins ago", timestamp: Date.now() - 1680000 },
  ]);

  // Simulate incoming donations
  useEffect(() => {
    const interval = setInterval(() => {
      const newDonation = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        group: groups[Math.floor(Math.random() * groups.length)],
        time: "Just now",
        timestamp: Date.now()
      };

      setDonations(prev => [newDonation, ...prev.slice(0, 6)]);
      
      toast({
        title: "New Donation!",
        description: `${newDonation.name} just donated ${newDonation.group} blood.`,
        duration: 3000,
        className: "bg-red-600 text-white border-none"
      });

    }, 8000); // New donation every 8 seconds

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="relative w-full py-8">
      
      {/* --- BACKGROUND DOODLES SECTION --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
         {/* Left Side Doodles */}
         <Heart className="absolute top-10 left-[5%] w-12 h-12 text-red-200/20 rotate-12" />
         <Plus className="absolute bottom-20 left-[10%] w-8 h-8 text-red-300/20 -rotate-12" />
         
         {/* Right Side Doodles */}
         <Droplet className="absolute top-0 right-[5%] w-16 h-16 text-red-100/30 rotate-12" />
         <Activity className="absolute bottom-10 right-[8%] w-14 h-14 text-red-200/20 -rotate-6" />
         
         {/* Center Area Doodles */}
         <TrendingUp className="absolute top-1/2 left-[2%] w-10 h-10 text-red-100/40 rotate-45" />
         <Heart className="absolute top-[20%] right-[20%] w-8 h-8 text-red-50/50 -rotate-12" />
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="relative z-10 w-full">
        
        {/* Section Title */}
       <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-[1.1] mb-16 tracking-tight text-center">
                Recent Donors <br className="hidden md:block" />
            </h1>
        </div>
        
        {/* Table Card */}
        <Card className="w-full border-none shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm">
          
          {/* Wrapper to ensure table layout consistency */}
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40%]">Donor Name</TableHead>
                  <TableHead className="w-[30%]">Blood Group</TableHead>
                  <TableHead className="w-[30%] text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence initial={false}>
                  {donations.map((donation) => (
                    <motion.tr
                      key={donation.id}
                      initial={{ opacity: 0, x: -20, backgroundColor: "rgba(254, 226, 226, 0.5)" }}
                      animate={{ opacity: 1, x: 0, backgroundColor: "rgba(255, 255, 255, 0)" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                      layout="position"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="truncate">{donation.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${
                          donation.group.includes('-') ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {donation.group}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                        {donation.time}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}