import { useState } from "react";
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
  Info
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
  regNumber?: string;
  status: Tab;
  time: string;
  medical: string;
}

const mockRegistrations: Registration[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@email.com",
    mobile: "9876543210",
    bloodGroup: "O+",
    age: 24,
    weight: 65,
    category: "Student",
    regNumber: "CS2021045",
    status: "Pending",
    time: "5 mins ago",
    medical: "None"
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya@email.com",
    mobile: "9988776655",
    bloodGroup: "A+",
    age: 21,
    weight: 52,
    category: "Student",
    regNumber: "IT2022012",
    status: "Pending",
    time: "12 mins ago",
    medical: "Minor asthma"
  },
  {
    id: "3",
    name: "Amit Singh",
    email: "amit@work.com",
    mobile: "9123456789",
    bloodGroup: "B-",
    age: 35,
    weight: 78,
    category: "Staff",
    status: "Approved",
    time: "1 hour ago",
    medical: "None"
  }
];

export default function Registrations() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("Pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [approveModal, setApproveModal] = useState<Registration | null>(null);
  const [rejectModal, setRejectModal] = useState<Registration | null>(null);

  const stats = {
    Pending: 15,
    Approved: 45,
    Rejected: 5,
    All: 65
  };

  const filtered = mockRegistrations.filter(r => {
    if (activeTab !== "All" && r.status !== activeTab) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleApprove = () => {
    toast({
      title: "Registration Approved",
      description: `Approval sent to ${approveModal?.name}`,
    });
    setApproveModal(null);
  };

  const handleReject = () => {
    toast({
      title: "Registration Rejected",
      description: `Rejection notice sent to ${rejectModal?.name}`,
      variant: "destructive"
    });
    setRejectModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Section */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/admin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-display font-bold text-gray-900">Donor Registrations</h1>
          </div>
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <Droplet className="w-5 h-5 fill-current" />
            <span>LifeLine Admin</span>
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
              <Select>
                <SelectTrigger className="w-[140px] h-11">
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[140px] h-11">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-11 px-4">
                <Calendar className="w-4 h-4 mr-2" /> Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registration List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((reg) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card className={cn(
                  "border-none shadow-md transition-all duration-300",
                  expandedId === reg.id ? "ring-2 ring-red-100" : ""
                )}>
                  <CardContent className="p-0">
                    <div 
                      className="p-4 md:p-6 cursor-pointer flex items-center justify-between"
                      onClick={() => setExpandedId(expandedId === reg.id ? null : reg.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold text-lg">
                          {reg.bloodGroup}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-display font-bold text-gray-900">{reg.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>{reg.age} Yrs</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>{reg.category}</span>
                            {reg.regNumber && (
                              <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="text-red-600 font-medium">{reg.regNumber}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered</p>
                          <p className="text-sm font-medium text-gray-900">{reg.time}</p>
                        </div>
                        {expandedId === reg.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === reg.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-gray-50"
                        >
                          <div className="p-6 space-y-8 bg-gray-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Contact & Medical Info */}
                              <div className="space-y-6">
                                <div className="space-y-3">
                                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Contact Details</p>
                                  <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                                      <Phone className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm font-medium">{reg.mobile}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                                      <Mail className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm font-medium">{reg.email}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Physical & Medical</p>
                                  <div className="flex gap-8">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Weight</p>
                                      <p className="font-bold text-gray-900">{reg.weight} kg</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Medical Conditions</p>
                                      <p className="font-bold text-gray-900">{reg.medical}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Checklist */}
                              <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Eligibility Auto-Check</p>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                                  <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm">Age eligible (18-65)</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm">Weight eligible ({">"}45kg)</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm">No recent donation (3 months)</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Internal Admin Notes</p>
                              <Textarea placeholder="Add notes for this donor..." className="bg-white border-gray-200" />
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                              <Button 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6"
                                onClick={() => setApproveModal(reg)}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                className="text-red-600 border-red-200 hover:bg-red-50 font-bold px-6"
                                onClick={() => setRejectModal(reg)}
                              >
                                <XCircle className="w-4 h-4 mr-2" /> Reject
                              </Button>
                              <Button variant="ghost" className="text-gray-500 font-bold ml-auto">
                                <MessageSquare className="w-4 h-4 mr-2" /> Contact Donor
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
            <div className="space-y-2">
              <Label>Admin Notes (Optional)</Label>
              <Textarea placeholder="Add additional instructions..." />
            </div>
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
