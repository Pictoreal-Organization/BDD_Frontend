import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Droplet, 
  Scale, 
  Calendar, 
  Heart, 
  History,
  Pencil,
  ChevronLeft,
  Lock,
  Trash2,
  AlertCircle,
  Clock
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul@email.com",
    mobile: "9876543210",
    category: "Student",
    regNumber: "CS2021045",
    bloodGroup: "O+",
    age: "24",
    weight: "65",
    conditions: "None"
  });

  const [editField, setEditField] = useState<{ key: keyof typeof profile; label: string } | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (key: keyof typeof profile, label: string) => {
    setEditField({ key, label });
    setTempValue(profile[key]);
  };

  const handleSave = () => {
    if (editField) {
      setProfile(prev => ({ ...prev, [editField.key]: tempValue }));
      toast({
        title: "Profile Updated",
        description: `${editField.label} has been successfully updated.`,
      });
      setEditField(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/donor-dashboard")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-display font-bold text-gray-900">My Profile</h1>
          </div>
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <Droplet className="w-5 h-5 fill-current" />
            <span>LifeLine</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Personal Information */}
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[
                { label: "Name", value: profile.name, icon: User },
                { label: "Email", value: profile.email, icon: Mail },
                { label: "Mobile", value: profile.mobile, icon: Phone, editable: true, key: "mobile" as const },
                { label: "Category", value: profile.category, icon: History },
                { label: "Reg Number", value: profile.regNumber, icon: History },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{item.label}</p>
                      <p className="font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                  {item.editable && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600"
                      onClick={() => handleEdit(item.key, item.label)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Card 2: Medical Information */}
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-red-600" /> Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 bg-red-50 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-red-600 font-bold mb-1">Blood Group</p>
                      <p className="text-4xl font-display font-black text-red-700">{profile.bloodGroup}</p>
                    </div>
                    <Droplet className="w-12 h-12 text-red-200 fill-current" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Age</p>
                    <p className="text-xl font-bold">{profile.age} Years</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Weight</p>
                    <p className="text-xl font-bold">{profile.weight} kg</p>
                  </div>
                  <div className="col-span-2 bg-gray-50 p-4 rounded-xl flex items-center justify-between group">
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">Medical Conditions</p>
                      <p className="text-gray-900 font-medium">{profile.conditions}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600"
                      onClick={() => handleEdit("conditions", "Medical Conditions")}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Donation Statistics */}
            <Card className="border-none shadow-lg bg-white overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" /> Donation Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-display font-bold text-gray-900">~6 Lives Saved</p>
                      <p className="text-sm text-muted-foreground">Based on your 2 donations</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">Level 2 Hero</p>
                    </div>
                  </div>
                  <Progress value={40} className="h-3 bg-red-100" indicatorClassName="bg-red-600" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[
                    { label: "Total", value: "2", icon: Droplet, color: "text-red-500" },
                    { label: "Last", value: "Dec 25", icon: Calendar, color: "text-gray-500" },
                    { label: "Eligible", value: "Mar 25", icon: Clock, color: "text-emerald-500" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <stat.icon className={cn("w-4 h-4", stat.color)} />
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold">{stat.label}</p>
                        <p className="text-sm font-bold">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-gray-200 hover:bg-gray-50">
              <Lock className="w-4 h-4 mr-2" /> Change Password
            </Button>
            <Button variant="ghost" className="h-11 px-6 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            Account created on Jan 12, 2024
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <Dialog open={!!editField} onOpenChange={() => setEditField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {editField?.label}</DialogTitle>
            <DialogDescription>
              Make changes to your {editField?.label.toLowerCase()} here.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-input">{editField?.label}</Label>
            <Input 
              id="edit-input" 
              value={tempValue} 
              onChange={(e) => setTempValue(e.target.value)}
              className="mt-2 h-12 text-lg"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setEditField(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 px-8" onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
