import { motion, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
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
    <Card className="border-none shadow-xl overflow-hidden bg-white">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          Recent Donors
        </h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[40%]">Donor Name</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead className="text-right">Time</TableHead>
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
                className="border-b last:border-0 hover:bg-gray-50/50"
              >
                <TableCell className="font-medium flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  {donation.name}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    donation.group.includes('-') ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {donation.group}
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-sm">
                  {donation.time}
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </Card>
  );
}
