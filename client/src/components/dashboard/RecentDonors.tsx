import { motion, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Clock, User, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Donation {
  _id: string;
  name: string;
  bloodGroup: string;
  completedAt: string;
}

export function RecentDonors() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to calculate "Time Ago"
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        // 1. Correctly construct the URL
        // If VITE_API_URL is "http://localhost:10000/api/donate", then we add "/recent"
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
        
        // Remove trailing slash if present to avoid double slashes
        const cleanBase = API_BASE.replace(/\/$/, ""); 
        const url = `${cleanBase}/recent`;

        console.log("Fetching recent donors from:", url); // DEBUG LOG

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Data received:", data); // DEBUG LOG

        // Ensure data is an array
        if (Array.isArray(data)) {
          setDonations(data);
        } else {
          setDonations([]);
          console.error("API returned non-array data:", data);
        }
      } catch (err: any) {
        console.error("Error loading recent donors:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
    const interval = setInterval(fetchDonors, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full py-8">
      {/* Background Doodles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-30">
         {/* ... (Keep your doodles code here if needed) ... */}
      </div>
      
      <div className="relative z-10 w-full">
        <div className="flex flex-col items-center justify-center mb-12 text-center">          
         <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">The Heroes</span>
            </h1>
          <p className="text-gray-500">Real-time updates of generous souls saving lives.</p>
        </div>
        
        <Card className="w-full border-none shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Donors
            </h2>
          </div>
          
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
                {/* LOADING STATE */}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                      Loading recent donors...
                    </TableCell>
                  </TableRow>
                )}

                {/* ERROR STATE */}
                {!loading && error && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-red-500 flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>Error: {error}</span>
                    </TableCell>
                  </TableRow>
                )}

                {/* EMPTY STATE */}
                {!loading && !error && donations.length === 0 && (
                   <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                      No donations yet. Be the first!
                    </TableCell>
                  </TableRow>
                )}

                {/* DATA STATE */}
                <AnimatePresence initial={false}>
                  {donations.map((donation) => (
                    <motion.tr
                      key={donation._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
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
                          (donation.bloodGroup || '').includes('-') ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {donation.bloodGroup || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                        {timeAgo(donation.completedAt)}
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