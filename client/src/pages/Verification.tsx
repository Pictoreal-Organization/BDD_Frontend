import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Droplet,
  CheckCircle2,
  ArrowRight,
  Phone,
  Calendar,
  AlertCircle,
  Clock,
  LogOut,
  Loader2,
  Printer,
  UserCheck,
  Mail,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

type ViewTab = "verify" | "completed";

// Interface matching Backend Search Response
interface Donor {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  rollNumber: string; // mapped from roll_number
  bloodGroup: string;
  age: number;
  year: string;
  branch: string;
  weight: number;
  status: string;
  approvedAt: string;
  registeredAt: string;
  completedAt?: string;
  updatedAt?: string;
}

export default function Verification() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // View State
  const [activeView, setActiveView] = useState<ViewTab>("verify");

  // Data States
  const [searchQuery, setSearchQuery] = useState("");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [completedDonors, setCompletedDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [completedPage, setCompletedPage] = useState(1);
  const [completedTotalPages, setCompletedTotalPages] = useState(1);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal States
  const [step, setStep] = useState<number>(0); // 0: None, 1: Identity, 2: Completion, 3: Success, 4: Unable

  // Form States
  const [collectedSuccess, setCollectedSuccess] = useState<string>("yes");
  const [units, setUnits] = useState<string>("1");
  const [rejectionReason, setRejectionReason] = useState("");

  // --- API CALLS ---

  // 1. Fetch Today's Count
  const fetchTodayCount = useCallback(async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
      const response = await fetch(`${API_BASE}/verify/count`);
      if (response.ok) {
        const data = await response.json();
        setTodayCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  }, []);

  // 2. Search Donors (Debounced or on Effect)

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
      const params = new URLSearchParams({ query: searchQuery });
      const response = await fetch(`${API_BASE}/verify/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDonors(data.donors);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // 3. Fetch Completed Donations
  const fetchCompletedDonations = useCallback(async () => {
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
      const params = new URLSearchParams({
        status: "completed",
        page: completedPage.toString(),
        limit: "10",
        sortBy: "completedAt",
        sortOrder: "desc"
      });
      const response = await fetch(`${API_BASE}/registrations?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Completed donors data:', data.donors); // Debug: Check what fields are available
        // Sort by completion time (most recent first) on client side
        const sortedDonors = data.donors.sort((a: Donor, b: Donor) => {
          // Try different possible field names for completion time
          const timeA = new Date(a.completedAt || a.updatedAt || a.approvedAt || a.registeredAt).getTime();
          const timeB = new Date(b.completedAt || b.updatedAt || b.approvedAt || b.registeredAt).getTime();
          console.log(`Comparing ${a.name}: ${a.completedAt || a.updatedAt || 'using fallback'} vs ${b.name}: ${b.completedAt || b.updatedAt || 'using fallback'}`);
          return timeB - timeA; // Descending order (newest first)
        });
        setCompletedDonors(sortedDonors);
        setCompletedTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching completed donations:", error);
    } finally {
      setLoading(false);
    }
  }, [completedPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDonors();
    }, 400); // debounce search

    return () => clearTimeout(timeout);
  }, [fetchDonors]);


  // Initial Load
  useEffect(() => {
    fetchTodayCount();
  }, [fetchTodayCount]);

  // Load completed donations when on completed tab
  useEffect(() => {
    if (activeView === "completed") {
      fetchCompletedDonations();
    }
  }, [activeView, fetchCompletedDonations]);


  // 3. Complete Donation Action
  const handleComplete = async (donor: Donor) => {
    setActionLoading(true);
    try {
      const API_BASE =
        import.meta.env.VITE_API_URL || "http://localhost:10000/api/donate";

      const response = await fetch(`${API_BASE}/verify/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId: donor.id }),
      });

      if (!response.ok) throw new Error("Failed");

      // ✅ update UI immediately
      setDonors(prev => prev.filter(d => d.id !== donor.id));
      fetchTodayCount();

      toast({
        title: "Donation Completed!",
        description: `${donor.name}'s donation recorded successfully.`,
      });

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not complete donation",
      });
    } finally {
      setActionLoading(false);
    }
  };


  // 4. Reject/Unable to Donate Action
  const handleRejection = async () => {
    if (!selectedDonor) return;

    setActionLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';

      // We use the status update endpoint to move them to 'rejected'
      const response = await fetch(`${API_BASE}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorIds: [selectedDonor.id],
          status: "rejected"
        })
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast({
        title: "Status Updated",
        description: "Donor marked as unable to donate.",
      });
      reset();

      // Refresh list to remove the rejected donor
      setDonors(prev => prev.filter(d => d.id !== selectedDonor.id));

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update donor status.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    if (!selectedDonor) return;
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
    // Open the certificate URL in a new tab
    window.open(`${API_BASE}/certificate/${selectedDonor.rollNumber}`, '_blank');
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

  const openVerification = (donor: Donor) => {
    setSelectedDonor(donor);
    setStep(1);
  };

  const reset = () => {
    setStep(0);
    setSelectedDonor(null);
    setCollectedSuccess("yes");
    setUnits("1");
    setRejectionReason("");
    // Refresh list
    setSearchQuery(prev => prev + " "); // Trigger small re-fetch hack or call fetchDonors()
  };

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-red-600 cursor-pointer" onClick={() => setLocation("/")}>
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
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

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* View Switcher */}
            <div className="flex gap-2">
              <Button
                variant={activeView === "verify" ? "default" : "outline"}
                onClick={() => setActiveView("verify")}
                className={cn(
                  "rounded-full px-6 h-10 font-bold transition-all",
                  activeView === "verify" ? "bg-red-600 hover:bg-red-700 shadow-lg" : "bg-white text-gray-600"
                )}
              >
                Verify Donors
              </Button>
              <Button
                variant={activeView === "completed" ? "default" : "outline"}
                onClick={() => setActiveView("completed")}
                className={cn(
                  "rounded-full px-6 h-10 font-bold transition-all",
                  activeView === "completed" ? "bg-red-600 hover:bg-red-700 shadow-lg" : "bg-white text-gray-600"
                )}
              >
                Completed Donations
              </Button>
            </div>

            {activeView === "verify" ? (
              <>
                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search Approved Donor (Name, Mobile, or Roll No)..."
                      // placeholder="Search Approved Donor (Name, Mobile, or Roll No)..." 
                      className="pl-12 h-14 text-lg rounded-2xl border-gray-200 shadow-sm bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="h-14 w-14 rounded-2xl bg-red-600 hover:bg-red-700 shadow-lg">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                  </Button>
                </div>

                {/* Donor List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" /> Completed Today ({todayCount})
                    </h2>
                    <div className="text-sm text-gray-500">
                      Found {donors.length} eligible donors
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                      <div className="flex justify-center items-center py-20 col-span-full">
                        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                      </div>
                    ) : donors.length > 0 ? (
                      donors.map((donor) => (
                        <motion.div key={donor.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                          <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                            <CardContent className="p-6 flex flex-col h-full">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold text-xl shrink-0">
                                    {donor.bloodGroup}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-display font-bold text-gray-900 line-clamp-1" title={donor.name}>{donor.name}</h3>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                      <span>{donor.age} Yrs</span>
                                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                      <span>{donor.year || "N/A"}</span>
                                      {donor.branch && (
                                        <>
                                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                          <span>{donor.branch}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Contact Details */}
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                  <span className="text-gray-700 truncate">{donor.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                                  <span className="text-gray-700 truncate" title={donor.email}>{donor.email}</span>
                                </div>
                              </div>

                              {/* Physical & Medical Info */}
                              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Weight</p>
                                  <p className="text-sm font-bold text-gray-900">{donor.weight} kg</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Medical</p>
                                  <p className="text-sm font-bold text-gray-900">N/A</p>
                                </div>
                              </div>

                              {/* Eligibility Checklist */}
                              <div className="space-y-2 mb-4 flex-grow">
                                <div className={cn("flex items-center gap-2 text-sm", donor.age >= 18 && donor.age <= 65 ? "text-emerald-600" : "text-red-600")}>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Age eligible (18-65)
                                </div>
                                <div className={cn("flex items-center gap-2 text-sm", donor.weight >= 45 ? "text-emerald-600" : "text-red-600")}>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Weight eligible ({donor.weight >= 45 ? ">45kg" : "ineligible"})
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  Registered {getTimeAgo(donor.registeredAt)}
                                </div>
                              </div>

                              <Button
                                disabled={actionLoading}
                                className="w-full h-11 bg-red-600 hover:bg-red-700 font-bold rounded-lg shadow-md"
                                onClick={() => handleComplete(donor)}
                              >
                                {actionLoading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Confirm Donation
                                  </>
                                )}
                              </Button>


                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No approved donors found matching "{searchQuery}"</p>
                        <p className="text-sm text-gray-400 mt-1">Make sure the registration is approved in the dashboard first.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Completed Donations Table View
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold text-gray-800">
                    Completed Donations
                  </h2>
                  <div className="text-sm text-gray-500">
                    Total: {completedDonors.length} completed
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                  </div>
                ) : completedDonors.length > 0 ? (
                  <>
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sr. No</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Blood Group</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Age</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Branch</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Completed</th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            <AnimatePresence mode="popLayout">
                              {completedDonors.map((donor, index) => (
                                <motion.tr
                                  key={donor.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-700">{(completedPage - 1) * 10 + index + 1}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                                      {donor.bloodGroup}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">{donor.name}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{donor.age} Yrs</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{donor.year}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{donor.branch || "-"}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{getTimeAgo(donor.completedAt || donor.updatedAt || donor.registeredAt)}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-bold capitalize">
                                      Completed
                                    </Badge>
                                  </td>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>
                    </Card>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                      <p className="text-sm text-muted-foreground">
                        Page {completedPage} of {completedTotalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCompletedPage(p => Math.max(1, p - 1))}
                          disabled={completedPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCompletedPage(p => p + 1)}
                          disabled={completedPage >= completedTotalPages}
                        >
                          Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No completed donations</h3>
                    <p className="text-gray-500">Completed donations will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Sidebar */}
          <div className="w-64 shrink-0">
            <Card className="border-none shadow-sm bg-white p-4 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Navigation</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/admin/dashboard")}
                  className="w-full justify-start h-12 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/admin/registrations")}
                  className="w-full justify-start h-12 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Registrations
                </Button>
                <Button
                  variant="default"
                  className="w-full justify-start h-12 px-4 text-sm font-bold bg-red-600 hover:bg-red-700 text-white"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Verify
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main >

      {/* Step 1: Identity Verification Modal */}
      < Dialog open={step === 1
      } onOpenChange={(open) => !open && reset()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Verify Donor Identity</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground uppercase">Name</span>
                <span className="font-bold">{selectedDonor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground uppercase">Blood Group</span>
                <span className="font-bold text-red-600">{selectedDonor?.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground uppercase">ID / Roll No</span>
                <span className="font-bold">{selectedDonor?.rollNumber || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-white border p-3 rounded-lg">
                <Checkbox id="id-verified" />
                <Label htmlFor="id-verified" className="text-sm font-medium">ID verified (College ID / Aadhar)</Label>
              </div>
              <div className="flex items-center space-x-3 bg-white border p-3 rounded-lg">
                <Checkbox id="ready" />
                <Label htmlFor="ready" className="text-sm font-medium">Donor present and ready</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={reset}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 px-8 font-bold" onClick={() => setStep(2)}>
              Proceed to Donation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Step 2: Donation Completion Modal */}
      < Dialog open={step === 2} onOpenChange={(open) => !open && reset()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Complete Donation</DialogTitle>
            <DialogDescription>
              Donation process for <span className="font-bold text-gray-900">{selectedDonor?.name}</span> ({selectedDonor?.bloodGroup})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-bold">Blood Collected Successfully?</Label>
              <RadioGroup value={collectedSuccess} onValueChange={setCollectedSuccess} className="flex gap-4">
                <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="font-medium cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="font-medium cursor-pointer">No (Unable to donate)</Label>
                </div>
              </RadioGroup>
            </div>

            {collectedSuccess === "yes" ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold">Units Collected:</Label>
                  <RadioGroup value={units} onValueChange={setUnits} className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="1" id="u1" />
                      <Label htmlFor="u1" className="text-sm cursor-pointer">1 unit (350ml)</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="2" id="u2" />
                      <Label htmlFor="u2" className="text-sm cursor-pointer">2 units (450ml)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Notes (Optional)</Label>
                  <Textarea placeholder="Add any observations during donation..." />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="update-dash" defaultChecked disabled />
                    <Label htmlFor="update-dash" className="text-sm font-normal">Update blood inventory automatically</Label>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={reset}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 px-8 font-bold" onClick={() => selectedDonor && handleComplete(selectedDonor)}
               disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (collectedSuccess === "yes" ? "Complete Donation" : "Next")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Variant: Rejected Modal (simplified) */}
      < Dialog open={step === 4} onOpenChange={(open) => !open && reset()}>
        <DialogContent className="sm:max-w-md text-center py-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Donation Rejected</DialogTitle>
            <DialogDescription className="pt-2">
              {selectedDonor?.name} has been marked as <span className="font-bold">Rejected</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Reason for Failure</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hb">Low hemoglobin</SelectItem>
                  <SelectItem value="bp">High/Low blood pressure</SelectItem>
                  <SelectItem value="ill">Recent illness</SelectItem>
                  <SelectItem value="med">Failed medical screening</SelectItem>
                  <SelectItem value="with">Donor withdrew</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Details</Label>
              <Textarea placeholder="Explain the situation..." />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={reset}>Cancel</Button>
            <Button className="bg-gray-900 hover:bg-black text-white px-8 font-bold" onClick={handleRejection} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      {/* Final Step: Success Modal */}
      < Dialog open={step === 3} onOpenChange={(open) => !open && reset()}>
        <DialogContent className="sm:max-w-md text-center py-10 overflow-hidden">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
            <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-black text-gray-900">Donation Completed!</DialogTitle>
              <p className="text-lg text-muted-foreground">
                <span className="font-bold text-gray-900">{selectedDonor?.name}</span> • {selectedDonor?.bloodGroup}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl text-left space-y-3 border border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <UserCheck className="w-3 h-3" /> Updated Statistics
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Donations Today</span>
                <span className="text-lg font-bold text-red-600">{todayCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 py-2 px-4 rounded-full">
              <AlertCircle className="w-4 h-4" />
              Inventory Updated Automatically
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button variant="outline" className="h-12 border-gray-200" onClick={handleDownloadCertificate}>
                <Printer className="w-4 h-4 mr-2" /> Print Certificate
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 h-12 font-bold shadow-lg" onClick={reset}>
                Verify Next Donor
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog >
    </div >
  );
}
