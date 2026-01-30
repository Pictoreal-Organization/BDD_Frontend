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
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  Loader2,
  Download,
  Table,
  FileText
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
      localStorage.removeItem('adminToken');
      setLocation("/admin");
    } catch (e) {
      localStorage.removeItem('adminToken');
      setLocation("/admin");
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
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center justify-center gap-4 lg:gap-6 text-sm font-semibold text-muted-foreground whitespace-nowrap">
              <button className="text-red-600 border-b-2 border-red-600 h-16 px-2 lg:px-4">Dashboard</button>
              <button 
                className="hover:text-red-600 transition-colors h-16 px-2 lg:px-4"
                onClick={() => setLocation("/admin/registrations")}
              >
                Registrations
              </button>
              <button 
                className="hover:text-red-600 transition-colors h-16 px-2 lg:px-4"
                onClick={() => setLocation("/admin/verify")}
              >
                Verify
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm font-medium">Welcome, Admin! 👋</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setLocation("/login")} className="text-muted-foreground sm:hidden">
              <LogOut className="w-5 h-5" />
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
                {/* Export Options */}
                <Card className="border-none shadow-xl bg-white overflow-hidden">
                  <CardHeader className="border-b border-gray-50">
                    <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                      <Download className="w-5 h-5 text-red-600" /> Export Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 rounded-xl border-2 border-gray-100 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all">
                      <Table className="w-5 h-5" /> 
                      <span className="font-bold text-sm">Export as CSV</span>
                    </Button>
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 rounded-xl border-2 border-gray-100 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all">
                      <FileText className="w-5 h-5" /> 
                      <span className="font-bold text-sm">Export as PDF</span>
                    </Button>
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 rounded-xl border-2 border-gray-100 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all">
                      <BarChart3 className="w-5 h-5" /> 
                      <span className="font-bold text-sm">Export as Excel</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}