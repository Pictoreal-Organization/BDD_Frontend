import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Register from "@/pages/Register";
import DonorDashboard from "@/pages/DonorDashboard";
import Profile from "@/pages/Profile";
import DonationHistory from "@/pages/DonationHistory";
import AdminDashboard from "@/pages/AdminDashboard";
import Registrations from "@/pages/Registrations";
import Verification from "@/pages/Verification";
import Reports from "@/pages/Reports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/register" component={Register} />
      <Route path="/donor-dashboard" component={DonorDashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/history" component={DonationHistory} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/registrations" component={Registrations} />
      <Route path="/admin/verify" component={Verification} />
      <Route path="/admin/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
