import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Droplet, 
  Heart, 
  Calendar, 
  Download, 
  Mail, 
  Clock, 
  Target,
  FileText,
  Table,
  LogOut,
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Interfaces for Data
interface BloodGroupData {
  group: string;
  count: number;
}

interface StatData {
  label: string;
  value: string;
  icon: any;
  color: string;
  bg: string;
}

export default function Reports() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Data States
  const [bloodData, setBloodData] = useState<BloodGroupData[]>([]);
  const [stats, setStats] = useState<StatData[]>([]);
  
  // Mock Data for charts not yet supported by backend (Trend/Category)
  // You can implement specific endpoints for these later.
  const categoryData = [
    { name: "Students", value: 65, color: "#DC2626" },
    { name: "Faculty", value: 10, color: "#EF4444" },
    { name: "Staff", value: 15, color: "#F87171" },
    { name: "External", value: 5, color: "#FCA5A5" },
  ];

  const trendData = [
    { date: "Day 1", count: 2 },
    { date: "Day 2", count: 5 },
    { date: "Day 3", count: 8 },
    { date: "Day 4", count: 15 },
    { date: "Day 5", count: 12 },
    { date: "Today", count: 20 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
        
        // Parallel Fetch: Inventory & General Stats
        const [invRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard/inventory`),
          fetch(`${API_BASE}/count`) // Using registration count endpoint
        ]);

        // Process Inventory for Bar Chart
        if (invRes.ok) {
          const invData = await invRes.json();
          const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
          const formatted = groups.map(g => ({
            group: g,
            count: invData.bloodGroups?.[g] || 0
          }));
          setBloodData(formatted);
        }

        // Process Stats Cards
        if (statsRes.ok) {
          const countData = await statsRes.json();
          const total = countData.totalRegistrations || 0;
          const completed = countData.approvedRegistrations || 0; // Using approved as proxy for completed/donated
          
          setStats([
            { label: "Total Registrations", value: total.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Approved Donors", value: completed.toString(), icon: Droplet, color: "text-red-600", bg: "bg-red-50" },
            { label: "Pending Review", value: countData.pendingRegistrations.toString(), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Lives Impacted", value: `~${completed * 3}`, icon: Heart, color: "text-pink-600", bg: "bg-pink-50" }, // Est. 3 lives per unit
          ]);
        }

      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = (type: 'csv' | 'excel' | 'pdf') => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
    // Trigger browser download by opening URL
    window.open(`${API_BASE}/download/${type}`, '_blank');
    
    toast({
      title: "Download Started",
      description: `Generating ${type.toUpperCase()} report...`,
    });
  };

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
    <div className="min-h-screen bg-gray-50/50 pb-20">
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
            <button 
              className="hover:text-red-600 transition-colors h-16 px-1"
              onClick={() => setLocation("/admin/dashboard")}
            >
              Dashboard
            </button>
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
            <button className="text-red-600 border-b-2 border-red-600 h-16 px-1">Reports</button>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm font-medium">Welcome, Admin! 👋</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
        
        {loading ? (
           <div className="flex items-center justify-center h-64">
             <Loader2 className="w-8 h-8 animate-spin text-red-600" />
           </div>
        ) : (
          <>
            {/* Overview Statistics Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-none shadow-md bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-display font-black text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Blood Group Distribution Bar Chart */}
              <Card className="border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="border-b border-gray-50">
                  <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-red-600" /> Blood Group Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 h-87.5">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bloodData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, color: "#9ca3af" }} />
                      <Tooltip 
                        cursor={{ fill: '#fef2f2' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" fill="#DC2626" radius={[6, 6, 0, 0]}>
                        {bloodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#DC2626" : "#EF4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Breakdown Donut Chart */}
              <Card className="border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="border-b border-gray-50">
                  <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-red-600" /> Category Breakdown (Est.)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 h-87.5 flex items-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 w-40 shrink-0">
                    {categoryData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-gray-700">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Donation Trend Line Chart */}
              <Card className="lg:col-span-2 border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="border-b border-gray-50">
                  <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-600" /> Daily Donation Trend (Last 5 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 h-87.5">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#DC2626" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Peak Hours & Top Contributors */}
              <div className="lg:col-span-1 space-y-8">
                <Card className="border-none shadow-xl bg-white overflow-hidden">
                  <CardHeader className="border-b border-gray-50">
                    <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-red-600" /> Peak Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {[
                      { range: "10:00 AM - 12:00 PM", count: 25 },
                      { range: "02:00 PM - 04:00 PM", count: 30 },
                      { range: "09:00 AM - 10:00 AM", count: 12 },
                    ].map((hour, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">{hour.range}</span>
                        <Badge className="bg-white text-red-600 border-red-100">{hour.count}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white overflow-hidden">
                  <CardHeader className="border-b border-gray-50">
                    <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-600" /> Top Contributors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {[
                      { name: "Computer Science Dept", count: 25 },
                      { name: "Mechanical Dept", count: 18 },
                      { name: "Faculty Body", count: 10 },
                    ].map((dept, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">{i+1}</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{dept.name}</p>
                          <p className="text-xs text-muted-foreground">{dept.count} donors provided</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Export & Email Options */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-none shadow-xl bg-white overflow-hidden">
                  <CardHeader className="border-b border-gray-50">
                    <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                      <Download className="w-5 h-5 text-red-600" /> Export Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2 rounded-2xl border-2 border-gray-50 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all"
                      onClick={() => handleDownload('csv')}
                    >
                      <Table className="w-5 h-5" /> Export as CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2 rounded-2xl border-2 border-gray-50 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all"
                      onClick={() => handleDownload('pdf')}
                    >
                      <FileText className="w-5 h-5" /> Export as PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2 rounded-2xl border-2 border-gray-50 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all"
                      onClick={() => handleDownload('excel')}
                    >
                      <BarChart3 className="w-5 h-5" /> Export as Excel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-red-600 text-white overflow-hidden">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                      <Mail className="w-5 h-5" /> Email Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Input 
                          placeholder="Send to: admin@college.edu" 
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-xl"
                        />
                      </div>
                      <Button className="h-12 px-8 bg-white text-red-600 hover:bg-red-50 font-bold rounded-xl shadow-lg">
                        Send Report
                      </Button>
                    </div>
                    <p className="mt-4 text-xs text-red-100 opacity-70">Reports include all detailed analytics and distribution charts for the selected date range.</p>
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