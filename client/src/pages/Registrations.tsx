import { useState,useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Droplet,
  Users,
  Calendar,
  MoreVertical,
  ArrowLeft,
  Info,
  Bell,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { set } from "react-hook-form";
import api from "@/lib/axios";
import { log } from "node:console";

type Tab = "Pending" | "Approved" | "Rejected" | "All";

interface Registration {
  id: string;
  name: string;
  email: string;
  mobile: string;
  bloodGroup: string;
  age: number;
  weight: number;
  category: string;
  rollNo?: string;
  status: Tab;
  timestamp: number;
  medical: string;
}

  // Simulate fetching data from an API

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function Registrations() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

useEffect(() => {
  const fetchRegistrations = async () => {
    try {
      const result = await api.get('/donate/admin');
      console.log(result.data);
      
      setRegistrations(result.data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive",
      });
    }
  };
  fetchRegistrations();
}, []);

  const [activeTab, setActiveTab] = useState<Tab>("Pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [approveModal, setApproveModal] = useState<Registration | null>(null);
  const [rejectModal, setRejectModal] = useState<Registration | null>(null);

  const stats = {
    Pending: registrations.filter(r=>r.status==="Pending").length,
    Approved: registrations.filter(r=>r.status==="Approved").length,
    Rejected: registrations.filter(r=>r.status==="Rejected").length,
    All: registrations.length,
  };

  const filtered = registrations.filter(r => {
    
    // if (activeTab !== "All" && r.status !== activeTab) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (bloodGroupFilter && bloodGroupFilter !== "all" && r.bloodGroup !== bloodGroupFilter) return false;
    if (categoryFilter && categoryFilter !== "all" && r.category !== categoryFilter) return false;
    return true;
  });

  const handleApprove = () => {
  if (!approveModal) return;

  setRegistrations(prev => prev.map(r =>r.id === approveModal.id? { ...r, status: "Approved" }: r) );

  // 2. Save to localStorage for Verify tab
  const approved = JSON.parse(localStorage.getItem("approvedDonors") || "[]");

  localStorage.setItem("approvedDonors",JSON.stringify([...approved, approveModal])
  );
  toast({
    title: "Registration Approved",
    description: `Approval sent to ${approveModal.name}`,
  });

  setApproveModal(null);
};


  const handleReject = () => {
  if (!rejectModal) return;

  setRegistrations(prev =>prev.map(r =>r.id === rejectModal.id  ? { ...r, status: "Rejected" } : r ));

  toast({
    title: "Registration Rejected",
    description: `Rejection notice sent to ${rejectModal.name}`,
    variant: "destructive",
  });

  setRejectModal(null);
};


  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Section */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-red-600 shrink-0 lg:flex-1">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
          </div>
          
          <div className="flex-1 overflow-x-auto scrollbar-hide mx-4 lg:flex-initial lg:overflow-visible">
            <div className="flex items-center justify-center gap-4 lg:gap-6 text-sm font-semibold text-muted-foreground whitespace-nowrap min-w-max lg:min-w-0">
              <button 
                className="hover:text-red-600 transition-colors h-16 px-2 lg:px-1"
                onClick={() => setLocation("/admin")}
              >
                Dashboard
              </button>
              <button className="text-red-600 border-b-2 border-red-600 h-16 px-2 lg:px-1">Registrations</button>
              <button 
                className="hover:text-red-600 transition-colors h-16 px-2 lg:px-1"
                onClick={() => setLocation("/admin/verify")}
              >
                Verify
              </button>
            </div>
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

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {(["Pending", "Approved", "Rejected", "All"] as Tab[]).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full px-6 h-10 font-bold transition-all",
                activeTab === tab ? "bg-red-600 hover:bg-red-700 shadow-lg" : "bg-white text-gray-600"
              )}
            >
              {tab}
              <span className={cn(
                "ml-2 px-2 py-0.5 rounded-full text-[10px] uppercase",
                activeTab === tab ? "bg-white/20" : "bg-gray-100"
              )}>
                {stats[tab]}
              </span>
            </Button>
          ))}
        </div>

        {/* Search & Filters */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search by name, email, mobile..." 
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                <SelectTrigger className="w-35 h-11">
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-35 h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Registration List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((reg) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold text-xl">
                          {reg.bloodGroup}
                        </div>
                        <div>
                          <h3 className="text-lg font-display font-bold text-gray-900">{reg.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>{reg.age} Yrs</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            {/* <span>{reg.category}</span> */}
                          </div>
                          {reg.rollNo && (
                            <p className="text-sm text-red-600 font-medium mt-1">{reg.rollNo}</p>
                          )}
                        </div>
                      </div>
                      {activeTab === "All" && (
                        <Badge className={cn(
                          "font-bold",
                          reg.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                          reg.status === "Rejected" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        )}>
                          {reg.status}
                        </Badge>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{reg.mobile}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{reg.email}</span>
                      </div>
                    </div>

                    {/* Physical & Medical Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Weight</p>
                        <p className="text-sm font-bold text-gray-900">{reg.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Medical</p>
                        <p className="text-sm font-bold text-gray-900">{reg.medical}</p>
                      </div>
                    </div>

                    {/* Eligibility Checklist */}
                    <div className="space-y-2 mb-4">
                      <div className={cn("flex items-center gap-2 text-sm", reg.age >= 18 && reg.age <= 65 ? "text-emerald-600" : "text-red-600")}>
                        {reg.age >= 18 && reg.age <= 65 ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>Age eligible (18-65)</span>
                      </div>
                      <div className={cn("flex items-center gap-2 text-sm", reg.weight > 45 ? "text-emerald-600" : "text-red-600")}>
                        {reg.weight > 45 ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>Weight eligible (&gt;45kg)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>No recent donation</span>
                      </div>
                    </div>

                    {/* Registration Time */}
                    <div className="mb-4 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Registered {getTimeAgo(reg.timestamp)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setApproveModal(reg);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRejectModal(reg);
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-muted-foreground">Showing 1-10 of {stats.Pending} pending registrations</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </main>

      {/* Approval Modal */}
      <Dialog open={!!approveModal} onOpenChange={() => setApproveModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Approve Registration?</DialogTitle>
            <DialogDescription>
              Confirming registration for <span className="font-bold text-gray-900">{approveModal?.name}</span> ({approveModal?.bloodGroup}).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="send-email" defaultChecked />
              <Label htmlFor="send-email" className="text-sm font-normal leading-tight">
                Send approval email to donor automatically.
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setApproveModal(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 px-8 font-bold" onClick={handleApprove}>Confirm Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={!!rejectModal} onOpenChange={() => setRejectModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Reject Registration?</DialogTitle>
            <DialogDescription>
              Rejecting registration for <span className="font-bold text-gray-900">{rejectModal?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical condition</SelectItem>
                  <SelectItem value="age">Age criteria not met</SelectItem>
                  <SelectItem value="weight">Weight criteria not met</SelectItem>
                  <SelectItem value="incomplete">Incomplete information</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Additional Details</Label>
              <Textarea placeholder="Explain the reason for rejection..." />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="send-reject-email" defaultChecked />
              <Label htmlFor="send-reject-email" className="text-sm font-normal leading-tight">
                Send rejection email to donor with reasons.
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 px-8 font-bold" onClick={handleReject}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
