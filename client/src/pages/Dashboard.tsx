import { Hero } from "@/components/dashboard/Hero";
import { BloodGrid } from "@/components/dashboard/BloodGrid";
import { RecentDonors } from "@/components/dashboard/RecentDonors";
import { Stats } from "@/components/dashboard/Stats"; // Import the new component
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 overflow-x-hidden">
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-red-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 font-display font-bold text-xl tracking-wide text-gray-900">
            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-red-200">
              +
            </div>
            Blood Donation Drive'26
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-4">
              <Button variant="ghost" className="text-gray-600 hover:text-red-600 hover:bg-red-50">About</Button>
              <Button variant="ghost" className="text-gray-600 hover:text-red-600 hover:bg-red-50">Campaigns</Button>
            </div>
            <Button size="lg" className="bg-red-600 text-white hover:bg-red-700 px-6 font-semibold shadow-lg" onClick={() => setLocation("/register")}>
              Register Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8">
        
        {/* PART 1: Hero */}
        <div className="container mx-auto px-4 mb-12">
          <Hero />
        </div>

        {/* PART 2: Stats Overview (New Section) */}
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-6xl mx-auto">
             <Stats />
          </div>
        </div>

        {/* PART 3: Blood Grid */}
        <BloodGrid />

        {/* PART 4: Recent Donors */}
        <div className="container mx-auto px-4 mt-12 mb-12">
          <div className="max-w-6xl mx-auto">
             <RecentDonors />
          </div>
        </div>

      </div>
    </div>
  );
}