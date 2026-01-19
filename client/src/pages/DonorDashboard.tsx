import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Home, 
  User, 
  History, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  PartyPopper,
  Calendar,
  MapPin,
  Download,
  Heart,
  Edit,
  Droplet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

type Status = "PENDING" | "APPROVED" | "COMPLETED";

export default function DonorDashboard() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<Status>("APPROVED");

  useEffect(() => {
    if (status === "COMPLETED") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#DC2626", "#FCA5A5", "#FFFFFF"]
      });
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-red-600">
            <Droplet className="w-6 h-6 fill-current" />
            LifeLine
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
              <Home className="w-4 h-4" /> Home
            </button>
            <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
              <User className="w-4 h-4" /> Profile
            </button>
            <button className="flex items-center gap-2 hover:text-red-600 transition-colors">
              <History className="w-4 h-4" /> History
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm font-medium">Welcome back, Sarah! 👋</span>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/login")} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Status Toggle for Mockup Demo */}
        <div className="flex justify-center gap-2 mb-8 bg-white p-1 rounded-full shadow-sm w-fit mx-auto border border-gray-100">
          {(["PENDING", "APPROVED", "COMPLETED"] as Status[]).map((s) => (
            <Button
              key={s}
              variant={status === s ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatus(s)}
              className={cn("rounded-full px-4", status === s && "bg-red-600 hover:bg-red-700")}
            >
              {s}
            </Button>
          ))}
        </div>

        {/* Status Cards */}
        <div className="mb-8">
          {status === "PENDING" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-none shadow-xl bg-orange-50 overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                    <Clock className="w-10 h-10 animate-pulse" />
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">PENDING APPROVAL</Badge>
                    <h2 className="text-2xl font-display font-bold text-gray-900">Your registration is under review</h2>
                    <p className="text-orange-800/80">Our team is verifying your medical details. You'll be notified soon.</p>
                    <p className="text-sm font-medium text-orange-700">Expected approval: Within 24 hours</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {status === "APPROVED" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-display font-bold">APPROVED</h2>
                      </div>
                      <p className="text-emerald-50 text-lg">You're all set to donate! Visit our center with a valid ID.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-emerald-200" />
                          <div>
                            <p className="text-[10px] uppercase opacity-70">Date</p>
                            <p className="font-semibold text-sm">March 25, 2025</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-emerald-200" />
                          <div>
                            <p className="text-[10px] uppercase opacity-70">Location</p>
                            <p className="font-semibold text-sm">College Auditorium</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-emerald-200" />
                          <div>
                            <p className="text-[10px] uppercase opacity-70">Time</p>
                            <p className="font-semibold text-sm">9:00 AM - 5:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold h-14 px-8 rounded-xl shadow-lg">
                      <Download className="w-5 h-5 mr-2" /> Download Letter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {status === "COMPLETED" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-none shadow-xl bg-white border-2 border-red-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <PartyPopper className="w-32 h-32 text-red-600" />
                </div>
                <CardContent className="p-8 text-center space-y-6">
                  <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-red-600 fill-red-600 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-bold text-gray-900">THANK YOU FOR DONATING!</h2>
                    <p className="text-muted-foreground text-lg">You've potentially saved 3 lives! ❤️❤️❤️</p>
                  </div>
                  <div className="flex justify-center gap-12 py-4 border-y border-gray-50">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground mb-1">Donated on</p>
                      <p className="font-bold text-gray-900">March 25, 2025</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground mb-1">Next Eligible</p>
                      <p className="font-bold text-red-600">June 25, 2025</p>
                    </div>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg">
                    <Download className="w-5 h-5 mr-2" /> Download Certificate
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Your Details */}
          <Card className="border-none shadow-lg bg-white">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-display font-bold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" /> Your Details
              </h3>
            </div>
            <CardContent className="p-6 grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600">O+</div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Blood Group</p>
                  <p className="font-bold">O Positive</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">24</div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Age</p>
                  <p className="font-bold">24 Years</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 col-span-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <Badge variant="outline" className="border-none p-0">🎓</Badge>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Category</p>
                  <p className="font-bold">Student</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-none shadow-lg bg-white">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-display font-bold text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5 text-red-600" /> Quick Stats
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              {[
                { label: "Total Donations", value: "2", icon: Droplet, color: "text-red-500", bg: "bg-red-50" },
                { label: "Last Donation", value: "Dec 25, 2024", icon: Calendar, color: "text-gray-500", bg: "bg-gray-50" },
                { label: "Next Eligible", value: "Mar 25, 2025", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-50" },
                { label: "Lives Saved", value: "~6", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg)}>
                      <stat.icon className={cn("w-4 h-4", stat.color)} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" className="h-12 px-8 rounded-xl border-gray-200 hover:bg-gray-50 font-semibold">
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
          <Button className="h-12 px-8 rounded-xl bg-red-600 hover:bg-red-700 shadow-lg font-semibold">
            <History className="w-4 h-4 mr-2" /> View Donation History
          </Button>
        </div>
      </main>
    </div>
  );
}
