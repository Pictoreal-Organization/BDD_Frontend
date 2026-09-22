import { Redirect, useLocation } from "wouter";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setIsAuthenticated(false);
      setLocation("/admin");
    } else {
      setIsAuthenticated(true);
    }
  }, [setLocation]);

  if (isAuthenticated === null) {
    return null; // Loading state
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
