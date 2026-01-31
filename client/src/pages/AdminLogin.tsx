import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, User, Lock, Eye, EyeOff, Activity, Heart, BarChart3, Droplet } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [, setLocation] = useLocation();

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      // Use relative path for same-origin requests (works in both dev and production)
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
      const apiUrl = `${API_BASE}/admin/login`;
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        setLocation("/admin/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Red Background with Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-red-700 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Droplet className="w-7 h-7 text-red-600 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Blood Donation Drive '26</h1>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-16">
            <h2 className="text-5xl font-display font-bold mb-4">Admin Portal</h2>
            <p className="text-xl text-red-100">
              Manage blood donation campaigns, track donors, and save lives
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Secure & Encrypted</h3>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Track Donor Health</h3>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Real-time Analytics</h3>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Comprehensive Reports</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-red-100 text-sm">© 2026 Blood Donation Drive. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold text-gray-900">Admin Login</h2>
              <p className="text-gray-500 mt-2">Sign in to access the admin dashboard</p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-xl shadow-lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                {loading ? "Signing in..." : "Sign In to Admin Panel"}
              </Button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
