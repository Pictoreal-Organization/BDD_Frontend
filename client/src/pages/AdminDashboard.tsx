import { motion } from "framer-motion";
import api from './../lib/axios';
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
  ArrowRight,
  Download,
  FileText,
  Table
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
          <div className="flex items-center gap-2 font-display font-bold text-xl text-red-600 shrink-0 lg:flex-1">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 text-sm font-semibold text-muted-foreground">
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
          </div>

          <div className="flex items-center gap-4 shrink-0 lg:flex-1 lg:justify-end">
            <span className="hidden lg:inline-block text-sm font-medium">Welcome, Admin Kumar! 👋</span>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/login")} className="text-muted-foreground hidden sm:flex">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setLocation("/login")} className="text-muted-foreground sm:hidden">
              <LogOut className="w-5 h-5" />
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

          {/* Export Options */}
          <Card className="border-none shadow-xl bg-white overflow-hidden flex flex-col">
            <CardHeader className="border-b border-gray-50">
              <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                <Download className="w-5 h-5 text-red-600" /> Export Options
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-6 flex-1">
              <Button variant="outline" className="h-32 flex-col gap-2 rounded-2xl border-2 border-gray-50 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all">
                <Table className="w-6 h-6" /> 
                <span className="font-bold">Export as CSV</span>
              </Button>
              <Button variant="outline" className="h-32 flex-col gap-2 rounded-2xl border-2 border-gray-50 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all">
                <FileText className="w-6 h-6" /> 
                <span className="font-bold">Export as PDF</span>
              </Button>
              <Button variant="outline" className="h-32 flex-col gap-2 rounded-2xl border-2 border-gray-50 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all">
                <BarChart3 className="w-6 h-6" /> 
                <span className="font-bold">Export as Excel</span>
              </Button>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
