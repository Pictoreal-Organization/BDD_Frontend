import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
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
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Interfaces for our data
interface DashboardStats {
  pending: number;
  approved: number;
  completed: number;
  rejected: number;
}

interface InventoryItem {
  group: string;
  count: number;
  max: number;
  color: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  icon: any;
  color: string;
  bg: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // 1. Stats State
  const [stats, setStats] = useState<DashboardStats>({
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0
  });

  // 2. Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // 3. Activity State
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  // Helper to calculate "Time Ago"
  const getTimeAgo = (dateString: string) => {
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

  // Helper to map action to icon/color
  const getActionStyle = (status: string) => {
    switch (status) {
      case "approved": return { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" };
      case "completed": return { icon: Droplet, color: "text-blue-500", bg: "bg-blue-50" };
      case "rejected": return { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" };
      default: return { icon: UserPlus, color: "text-gray-500", bg: "bg-gray-50" }; // pending/registered
    }
  };

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
        
        // Parallel fetching for speed
        const [statsRes, invRes, actRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard/stats`),
          fetch(`${API_BASE}/dashboard/inventory`),
          fetch(`${API_BASE}/dashboard/activity?limit=5`)
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (invRes.ok) {
          const invData = await invRes.json();
          const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
          const colors = [
            "bg-red-700", "bg-red-600", "bg-red-500", "bg-red-400",
            "bg-red-300", "bg-red-200", "bg-red-800", "bg-red-600"
          ];
          
          const mappedInv = groups.map((g, i) => ({
            group: g,
            count: invData.bloodGroups?.[g] || 0,
            max: 100, // Target max for progress bar
            color: colors[i]
          }));
          setInventory(mappedInv);
        }

        if (actRes.ok) {
          const actData = await actRes.json();
          const mappedAct = actData.map((item: any) => {
            const style = getActionStyle(item.status); // Use status to determine style
            return {
              id: item.id,
              user: item.name,
              action: item.status === 'pending' ? 'registered' : item.status,
              time: getTimeAgo(item.timestamp || item.createdAt), // Handle inconsistent backend naming if any
              icon: style.icon,
              color: style.color,
              bg: style.bg
            };
          });
          setActivity(mappedAct);
        }

      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Could not load live dashboard data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
      await fetch(`${API_BASE}/logout`);
      setLocation("/login");
    } catch (e) {
      setLocation("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-red-600 cursor-pointer" onClick={() => setLocation("/")}>
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
            <button 
              className="hover:text-red-600 transition-colors h-16 px-1"
              onClick={() => setLocation("/admin/reports")}
            >
              Reports
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm font-medium">Welcome, Admin! 👋</span>
            <Button variant="ghost" size="icon" className="relative text-gray-400">
              <Bell className="w-5 h-5" />
              {stats.pending > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {loading ? (
           <div className="flex items-center justify-center h-64">
             <Loader2 className="w-8 h-8 animate-spin text-red-600" />
           </div>
        ) : (
          <>
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Pending", value: stats.pending, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
                { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                { label: "Completed", value: stats.completed, icon: Droplet, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                { label: "Rejected", value: stats.rejected, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={cn("border-none shadow-md hover:shadow-lg transition-all", stat.bg)}>
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
                  <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live Inventory
                  </Badge>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {inventory.length > 0 ? (
                    inventory.map((bg, i) => (
                      <div key={i} className="space-y-2 group">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-gray-700 w-8">{bg.group}</span>
                          <span className="text-xs font-bold text-gray-400 group-hover:text-red-600 transition-colors">{bg.count} Units</span>
                        </div>
                        <Progress 
                          value={Math.min((bg.count / bg.max) * 100, 100)} 
                          className="h-3 bg-gray-50" 
                          indicatorClassName={cn("transition-all duration-1000", bg.color)} 
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-400">No inventory data available.</div>
                  )}
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
                      {activity.length > 0 ? (
                        activity.map((item, i) => (
                          <div key={item.id || i} className="flex gap-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900 leading-tight">
                                <span className="font-bold">{item.user}</span> <span className="opacity-80">{item.action}</span>
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {item.time}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-sm text-gray-400 py-4">No recent activity</div>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full mt-6 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-bold"
                      onClick={() => setLocation("/admin/registrations")}
                    >
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
                    <button 
                      className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left group"
                      onClick={() => setLocation("/admin/registrations")}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold">{stats.pending} Pending Registrations</p>
                        <p className="text-xs text-red-100 opacity-80">Requires manual verification</p>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    
                    <button 
                      className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left group"
                      onClick={() => setLocation("/admin/verify")}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold">{stats.approved} Ready to Donate</p>
                        <p className="text-xs text-red-100 opacity-80">Approved & waiting for drive</p>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-12">
              <Button 
                className="h-14 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-lg font-bold shadow-xl flex-1 sm:flex-none"
                onClick={() => setLocation("/admin/registrations")}
              >
                View Pending Registrations
              </Button>
              <Button 
                variant="outline" 
                className="h-14 px-8 rounded-2xl border-gray-200 text-lg font-bold hover:bg-gray-50 flex-1 sm:flex-none"
                onClick={() => setLocation("/admin/verify")}
              >
                Start Verification Process
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}