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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-red-600">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              +
            </div>
            LifeLine
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-red-600">
              About
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-red-600">
              Campaigns
            </Button>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 shadow-md"
              onClick={() => setLocation("/login")}
            >
              <LogIn className="w-4 h-4 mr-2" /> Login
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Hero />
        
        <div className="max-w-6xl mx-auto">
          <Stats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <BloodGrid />
              
              {/* Additional Content / CTA Section */}
              <div className="mt-8 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgb(17, 24, 39), rgb(31, 41, 55))' }}>
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
            
            <div className="lg:col-span-1">
              <RecentDonors />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
