import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Droplet,
  Calendar,
  LogOut,
  Loader2,
  ChevronLeft,
  ChevronRight
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

type Tab = "pending" | "approved" | "rejected" | "all";

// Interface matching your Backend Response
interface Donor {
  id: string; // mapped from _id
  name: string;
  email: string;
  phoneNumber: string;
  bloodGroup: string;
  age: number;
  weight: number;
  category: string; // mapped from 'year' or 'category'
  branch?: string;
  status: string;
  registeredAt: string; // mapped from createdAt
  medicalConditions?: string;
}

interface ApiResponse {
  donors: Donor[];
  counts: {
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
    all: number;
  };
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  }
}

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
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

  // State
  const [registrations, setRegistrations] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, all: 0 });
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [bloodFilter, setBloodFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Modals
  const [approveModal, setApproveModal] = useState<Donor | null>(null);
  const [rejectModal, setRejectModal] = useState<Donor | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // FETCH DATA
  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/donate';
      
      // Build Query Params
      const params = new URLSearchParams({
        status: activeTab,
        page: page.toString(),
        limit: "9", // Cards per page
        search: searchQuery,
      });

      if (bloodFilter) params.append("bloodGroup", bloodFilter);
      if (categoryFilter) params.append("category", categoryFilter);

      const response = await fetch(`${API_BASE}/registrations?${params.toString()}`);
      
      if (!response.ok) throw new Error("Failed to fetch data");

      const data: ApiResponse = await response.json();
      
      setRegistrations(data.donors);
      setCounts(data.counts);
      setTotalPages(data.pagination.totalPages);

    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load registrations.",
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, page, bloodFilter, categoryFilter, toast]);

  // Initial Fetch & Refetch on dependencies change
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // API ACTIONS
  const updateStatus = async (donor: Donor, newStatus: "approved" | "rejected") => {
    setActionLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
      
      const response = await fetch(`${API_BASE}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorIds: [donor.id],
          status: newStatus
        })
      });

      if (!response.ok) throw new Error("Update failed");

      toast({
        title: `Registration ${newStatus === "approved" ? "Approved" : "Rejected"}`,
        description: `${donor.name} has been updated.`,
        variant: newStatus === "approved" ? "default" : "destructive"
      });

      // Refresh list
      fetchRegistrations();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: "Please try again.",
      });
    } finally {
      setActionLoading(false);
      setApproveModal(null);
      setRejectModal(null);
    }
  };

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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Section */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-red-600 cursor-pointer" onClick={() => setLocation("/")}>
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center justify-center gap-4 lg:gap-6 text-sm font-semibold text-muted-foreground whitespace-nowrap">
              <button 
                className="hover:text-red-600 transition-colors h-16 px-2 lg:px-4"
                onClick={() => setLocation("/admin")}
              >
                Dashboard
              </button>
              <button className="text-red-600 border-b-2 border-red-600 h-16 px-2 lg:px-4">Registrations</button>
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

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {(["pending", "approved", "rejected", "all"] as Tab[]).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => { setActiveTab(tab); setPage(1); }}
              className={cn(
                "rounded-full px-6 h-10 font-bold transition-all capitalize",
                activeTab === tab ? "bg-red-600 hover:bg-red-700 shadow-lg" : "bg-white text-gray-600"
              )}
            >
              {tab}
              <span className={cn(
                "ml-2 px-2 py-0.5 rounded-full text-[10px]",
                activeTab === tab ? "bg-white/20" : "bg-gray-100"
              )}>
                {/* Dynamically access the count using key */}
                {counts[tab === "all" ? "all" : tab] || 0}
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
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex gap-2">
              <Select value={bloodFilter} onValueChange={(v) => { setBloodFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[140px] h-11">
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Groups</SelectItem>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[140px] h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Registration List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {registrations.length > 0 ? (
                registrations.map((reg) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <CardContent className="p-6 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold text-xl shrink-0">
                              {reg.bloodGroup}
                            </div>
                            <div>
                              <h3 className="text-lg font-display font-bold text-gray-900 line-clamp-1" title={reg.name}>{reg.name}</h3>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span>{reg.age} Yrs</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span>{reg.category}</span>
                                {reg.branch && (
                                  <>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{reg.branch}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {activeTab === "all" && (
                            <Badge className={cn(
                              "font-bold capitalize",
                              reg.status === "approved" || reg.status === "completed" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                              reg.status === "rejected" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                              "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            )}>
                              {reg.status}
                            </Badge>
                          )}
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-gray-700 truncate">{reg.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                            <span className="text-gray-700 truncate" title={reg.email}>{reg.email}</span>
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
                            <p className="text-sm font-bold text-gray-900 truncate" title={reg.medicalConditions || "None"}>
                              {reg.medicalConditions || "None"}
                            </p>
                          </div>
                        </div>

                        {/* Eligibility Checklist */}
                        <div className="space-y-2 mb-4">
                          <div className={cn("flex items-center gap-2 text-sm", reg.age >= 18 && reg.age <= 65 ? "text-emerald-600" : "text-red-600")}>
                            {reg.age >= 18 && reg.age <= 65 ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            <span>Age eligible (18-65)</span>
                          </div>
                          <div className={cn("flex items-center gap-2 text-sm", reg.weight > 45 ? "text-emerald-600" : "text-red-600")}>
                            {reg.weight > 45 ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            <span>Weight eligible (&gt;45kg)</span>
                          </div>
                        </div>

                        {/* Registration Time */}
                        <div className="mb-4 text-sm text-muted-foreground mt-auto">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Registered {getTimeAgo(reg.registeredAt)}
                        </div>

                        {/* Action Buttons (Only for Pending) */}
                        {reg.status === "pending" && (
                          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                            <Button 
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setApproveModal(reg);
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                            </Button>
                            <Button 
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-9"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRejectModal(reg);
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No registrations found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {registrations.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
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
            <Button variant="ghost" onClick={() => setApproveModal(null)} disabled={actionLoading}>Cancel</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 px-8 font-bold" 
              onClick={() => approveModal && updateStatus(approveModal, "approved")}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Approval"}
            </Button>
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
            <Button variant="ghost" onClick={() => setRejectModal(null)} disabled={actionLoading}>Cancel</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 px-8 font-bold" 
              onClick={() => rejectModal && updateStatus(rejectModal, "rejected")}
              disabled={actionLoading}
            >
               {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}