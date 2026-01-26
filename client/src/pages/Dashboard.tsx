import { Hero } from "@/components/dashboard/Hero";
import { Stats } from "@/components/dashboard/Stats";
import { BloodGrid } from "@/components/dashboard/BloodGrid";
import { RecentDonors } from "@/components/dashboard/RecentDonors";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useLocation } from "wouter";


export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-red-200 shadow-sm relative overflow-hidden">
  
  {/* Background Pattern (Opacity reduced for white background) */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

  <div className="container mx-auto px-4 h-20 flex items-center justify-between relative z-10">
    {/* Logo */}
    <div className="flex items-center gap-3 font-display font-bold text-xl tracking-wide text-gray-900">
      <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-red-200">
        +
      </div>
      Blood Donation Drive'26
    </div>

    {/* Navigation & Action */}
    <div className="flex items-center gap-6">
      <div className="hidden md:flex gap-4">
        <Button variant="ghost" className="text-gray-600 hover:text-red-600 hover:bg-red-50">
          About
        </Button>
        <Button variant="ghost" className="text-gray-600 hover:text-red-600 hover:bg-red-50">
          Campaigns
        </Button>
      </div>
      
      {/* Register Button (High Contrast) */}
      <Button 
        size="lg" 
        className="bg-red-600 text-white hover:bg-red-700 px-6 font-semibold shadow-lg shadow-red-200 whitespace-nowrap"
        onClick={() => setLocation("/register")}
      >
        Register Now
      </Button>
    </div>
  </div>
</nav>

      {/* Main Content */}
      <div className="py-8">
        
        {/* PART 1: Hero & Stats (Constrained Container) */}
        <div className="container mx-auto px-4 mb-12">
          <Hero />
          <div className="max-w-6xl mx-auto mt-4 mb-16">
            
          </div>
        </div>

        {/* PART 2: Blood Grid (Full Width - Outside Container) */}
        <BloodGrid />

        {/* PART 3: Bottom Section - CTA & Recent Donors (Constrained Container) */}
        <div className="container mx-auto px-4 mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: CTA Card */}
              <div className="lg:col-span-2">
                <div className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold font-display mb-2">Ready to make a difference?</h3>
                      <p className="text-gray-300">Book your slot at the nearest donation center.</p>
                    </div>
                    <Button 
                      size="lg" 
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 font-semibold shadow-lg whitespace-nowrap"
                      onClick={() => setLocation("/register")}
                    >
                      Register Now
                    </Button>
                  </div>
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>
              </div>

              {/* Right Column: Recent Donors */}
              <div className="lg:col-span-1">
                <RecentDonors />
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}