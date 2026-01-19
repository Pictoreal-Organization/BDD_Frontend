import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  Droplet, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart3,
  Bell,
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const bloodDistribution = [
  { group: "A+", count: 45, max: 80, color: "bg-red-700" },
  { group: "A-", count: 18, max: 80, color: "bg-red-600" },
  { group: "B+", count: 32, max: 80, color: "bg-red-500" },
  { group: "B-", count: 12, max: 80, color: "bg-red-400" },
  { group: "AB+", count: 15, max: 80, color: "bg-red-300" },
  { group: "AB-", count: 4, max: 80, color: "bg-red-200" },
  { group: "O+", count: 65, max: 80, color: "bg-red-800" },
  { group: "O-", count: 28, max: 80, color: "bg-red-600" },
];

const activity = [
  { user: "Rahul Sharma", action: "registered", time: "5 mins ago", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50" },
  { user: "Priya Patel", action: "donation completed", time: "10 mins ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  { user: "Amit Kumar", action: "approved", time: "15 mins ago", icon: ShieldCheck, color: "text-red-500", bg: "bg-red-50" },
  { user: "Sneha Reddy", action: "units verified", time: "25 mins ago", icon: Droplet, color: "text-red-600", bg: "bg-red-50" },
  { user: "Vikram Singh", action: "eligibility checked", time: "1 hour ago", icon: Users, color: "text-gray-500", bg: "bg-gray-50" },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-red-600">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            Admin Panel
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <button className="text-red-600 border-b-2 border-red-600 h-16 px-1">Dashboard</button>
            <button 
              className="hover:text-red-600 transition-colors h-16 px-1"
              onClick={() => setLocation("/admin/registrations")}
            >
              Registrations
            </button>
            <button 
              className="hover:text-red-600 transition-colors h-16 px-1"
              onClick={() => setLocation("/admin/verify")}
            >
              Verify
            </button>
            <button className="hover:text-red-600 transition-colors h-16 px-1">Reports</button>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm font-medium">Welcome, Admin Kumar! 👋</span>
            <Button variant="ghost" size="icon" className="relative text-gray-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/login")} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Pending", value: "15", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
            { label: "Approved", value: "45", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Completed", value: "30", icon: Droplet, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "Rejected", value: "5", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn("border-none shadow-md", stat.bg)}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-wider opacity-60">{stat.label}</p>
                      <p className={cn("text-4xl font-display font-black", stat.color)}>{stat.value}</p>
                    </div>
                    <div className={cn("p-3 rounded-xl bg-white/50 shadow-sm", stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blood Group Distribution */}
          <Card className="lg:col-span-2 border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-600" /> Blood Group Distribution
              </CardTitle>
              <Badge variant="outline">Live Inventory</Badge>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {bloodDistribution.map((bg, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-gray-700 w-8">{bg.group}</span>
                    <span className="text-xs font-bold text-gray-400">{bg.count} Units</span>
                  </div>
                  <Progress 
                    value={(bg.count / bg.max) * 100} 
                    className="h-3 bg-gray-50" 
                    indicatorClassName={cn("transition-all duration-1000", bg.color)} 
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-50">
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-600" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {activity.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                          <span className="font-bold">{item.user}</span> {item.action}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-bold">
                  View All Activity <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Action Required Alerts */}
            <Card className="border-none shadow-xl bg-red-600 text-white overflow-hidden">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Action Required
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left group">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">15 Pending Registrations</p>
                    <p className="text-xs text-red-100 opacity-80">Requires manual verification</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left group">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">8 Ready to Donate</p>
                    <p className="text-xs text-red-100 opacity-80">Drive date: Mar 25, 2025</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            className="h-14 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-lg font-bold shadow-xl"
            onClick={() => setLocation("/admin/registrations")}
          >
            View Pending Registrations
          </Button>
          <Button 
            variant="outline" 
            className="h-14 px-8 rounded-2xl border-gray-200 text-lg font-bold hover:bg-gray-50"
            onClick={() => setLocation("/admin/verify")}
          >
            Start Verification Process
          </Button>
        </div>
      </main>
    </div>
  );
}
