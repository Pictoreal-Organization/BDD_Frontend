import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  ChevronLeft, 
  Droplet, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Download, 
  FileText,
  Heart,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const donations = [
  {
    id: 2,
    date: "December 25, 2024",
    bloodGroup: "O+",
    units: "1 unit (350ml)",
    location: "College Auditorium",
    verifiedBy: "Dr. Admin Kumar",
  },
  {
    id: 1,
    date: "August 12, 2024",
    bloodGroup: "O+",
    units: "1 unit (350ml)",
    location: "City Blood Bank",
    verifiedBy: "Dr. Sarah Smith",
  }
];

export default function DonationHistory() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/donor-dashboard")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-display font-bold text-gray-900">Donation History</h1>
          </div>
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <Droplet className="w-5 h-5 fill-current" />
            <span>LifeLine</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                <Droplet className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Donations</p>
                <p className="text-3xl font-display font-bold text-gray-900">2</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Impact</p>
                <p className="text-3xl font-display font-bold text-gray-900">~6 Lives Saved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline View */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />

          <div className="space-y-12">
            {donations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative flex flex-col md:flex-row items-start md:items-center w-full",
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                )}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-red-600 border-4 border-white shadow-sm -translate-x-1/2 z-10" />

                {/* Content Card */}
                <div className={cn(
                  "w-full md:w-[45%] pl-10 md:pl-0",
                  index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                )}>
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="bg-red-50 text-red-700 border-none font-bold">
                          Donation #{donation.id}
                        </Badge>
                        <Droplet className="w-6 h-6 text-red-200 fill-current" />
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Donation Date</p>
                        <h3 className="text-2xl font-display font-bold text-gray-900">{donation.date}</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium">{donation.bloodGroup}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span className="text-sm font-medium">{donation.units}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{donation.location}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2 text-emerald-600">
                          <UserCheck className="w-4 h-4" />
                          <span className="text-xs font-semibold">Verified by {donation.verifiedBy}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm mt-4">
                        <Download className="w-4 h-4 mr-2" /> Download Certificate
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Date Side Label (Desktop Only) */}
                <div className={cn(
                  "hidden md:block w-[45%]",
                  index % 2 === 0 ? "text-left pl-12" : "text-right pr-12"
                )}>
                  <p className="text-sm font-bold text-red-600 uppercase tracking-widest opacity-50">
                    Step toward a better world
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-20">
          <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 border-gray-300 hover:border-red-300 hover:text-red-600 transition-all group">
            <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> 
            Export History as PDF
          </Button>
        </div>
      </main>
    </div>
  );
}
