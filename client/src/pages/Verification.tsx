import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Droplet, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  ArrowRight,
  UserCheck,
  Phone,
  Calendar,
  AlertCircle,
  Clock,
  Heart,
  Bell,
  LogOut
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
import confetti from "canvas-confetti";

interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  regNumber: string;
  category: string;
  phone: string;
  lastDonation: string;
  eligible: boolean;
}



export default function Verification() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [approvedDonors, setApprovedDonors] = useState<Donor[]>([]);
  
  // Modal States
  const [step, setStep] = useState<number>(0); // 0: None, 1: Identity, 2: Completion, 3: Success, 4: Unable
  const [collectedSuccess, setCollectedSuccess] = useState<string>("yes");
  const [units, setUnits] = useState<string>("1");

  const openVerification = (donor: Donor) => {
    setSelectedDonor(donor);
    setStep(1);
  };

  useEffect(() => {
   const stored = JSON.parse(localStorage.getItem("approvedDonors") || "[]");
   setApprovedDonors(stored);
   }, []);

  const handleComplete = () => {
    if (collectedSuccess === "yes") {
      setStep(3);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#DC2626", "#FCA5A5", "#FFFFFF"]
      });
    } else {
      setStep(4);
    }
  };

  const reset = () => {
    setStep(0);
    setSelectedDonor(null);
    setCollectedSuccess("yes");
    setUnits("1");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-red-600">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            Admin Panel
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <button 
              className="hover:text-red-600 transition-colors h-16 px-1"
              onClick={() => setLocation("/admin")}
            >
              Dashboard
            </button>
            <button 
              className="hover:text-red-600 transition-colors h-16 px-1"
              onClick={() => setLocation("/admin/registrations")}
            >
              Registrations
            </button>
            <button className="text-red-600 border-b-2 border-red-600 h-16 px-1">Verify</button>
            <button 
              className="hover:text-red-600 transition-colors h-16 px-1"
              onClick={() => setLocation("/admin/reports")}
            >
              Reports
            </button>
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

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search Approved Donor (Name, Mobile, or Reg Number)..." 
              className="pl-12 h-14 text-lg rounded-2xl border-gray-200 shadow-sm bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-14 w-14 rounded-2xl bg-red-600 hover:bg-red-700 shadow-lg">
            <Search className="w-6 h-6" />
          </Button>
        </div>

        {/* Donor List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" /> Approved Donors Today ({approvedDonors.length})
            </h2>
          </div>

          <div className="grid gap-4">
            {approvedDonors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((donor) => (
              <motion.div key={donor.id} layout>
                <Card className="border-none shadow-md hover:shadow-lg transition-all bg-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{donor.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          {donor.regNumber} • {donor.category}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 font-black text-lg border border-red-100">
                        {donor.bloodGroup}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {donor.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Last: <span className={cn(donor.lastDonation === "Never" ? "text-gray-400" : "text-emerald-600 font-bold")}>
                          {donor.lastDonation} {donor.eligible && " (✅ Eligible)"}
                        </span>
                      </div>
                    </div>

                    <Button 
                      className="w-full h-12 bg-red-600 hover:bg-red-700 font-bold rounded-xl shadow-md group"
                      onClick={() => openVerification(donor)}
                    >
                      Verify & Start Process <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Step 1: Identity Verification Modal */}
      <Dialog open={step === 1} onOpenChange={(open) => !open && reset()}>
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
                <span className="text-xs text-muted-foreground uppercase">Reg Number</span>
                <span className="font-bold">{selectedDonor?.regNumber}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-white border p-3 rounded-lg">
                <Checkbox id="id-verified" />
                <Label htmlFor="id-verified" className="text-sm font-medium">ID verified (Aadhar/College ID)</Label>
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
      </Dialog>

      {/* Step 2: Donation Completion Modal */}
      <Dialog open={step === 2} onOpenChange={(open) => !open && reset()}>
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
                      <Label htmlFor="u1" className="text-sm cursor-pointer">1 unit (350ml) - Standard</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="2" id="u2" />
                      <Label htmlFor="u2" className="text-sm cursor-pointer">2 units (450ml) - Double</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Notes (Optional)</Label>
                  <Textarea placeholder="Add any observations during donation..." />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="thank-you" defaultChecked />
                    <Label htmlFor="thank-you" className="text-sm font-normal">Send thank you email</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="update-dash" defaultChecked />
                    <Label htmlFor="update-dash" className="text-sm font-normal">Update public dashboard</Label>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={reset}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 px-8 font-bold" onClick={handleComplete}>
              {collectedSuccess === "yes" ? "Complete Donation" : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variant: Unable to Donate Modal */}
      <Dialog open={step === 4} onOpenChange={(open) => !open && reset()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">Unable to Donate</DialogTitle>
            <DialogDescription>
              Record the reason why <span className="font-bold">{selectedDonor?.name}</span> could not donate.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Reason for Failure</Label>
              <Select>
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
            <div className="space-y-2">
              <Label>Next Eligible Date</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={reset}>Cancel</Button>
            <Button className="bg-gray-900 hover:bg-black text-white px-8 font-bold" onClick={reset}>
              Save & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Step: Success Modal */}
      <Dialog open={step === 3} onOpenChange={(open) => !open && reset()}>
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
                <span className="text-lg font-bold text-red-600">31</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{selectedDonor?.bloodGroup} Donations</span>
                <span className="text-lg font-bold text-red-600">8</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 py-2 px-4 rounded-full">
              <AlertCircle className="w-4 h-4" />
              Toast notification sent to public dashboard!
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button variant="outline" className="h-12 border-gray-200">
                <Printer className="w-4 h-4 mr-2" /> Print Certificate
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 h-12 font-bold shadow-lg" onClick={reset}>
                Verify Next Donor
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
