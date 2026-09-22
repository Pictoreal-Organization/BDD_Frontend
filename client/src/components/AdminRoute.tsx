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
    const checkAuth = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
        const res = await fetch(`${API_BASE}/check-session`, { credentials: 'include' });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
