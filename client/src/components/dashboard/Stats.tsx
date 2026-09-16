import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Heart, Activity, Award } from "lucide-react";

export function Stats() {
  const [currentDonors, setCurrentDonors] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api/donate';
        const response = await fetch(`${API_BASE}/dashboard/stats`);
        if (response.ok) {
          const data = await response.json();
          setCurrentDonors(data.completed || 0); 
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Donors in 2026",
      value: loading ? "..." : currentDonors.toString(),
      icon: Users,
      color: "text-red-600",
      bg: "bg-red-100",
      delay: 0.1,
    },
    {
      title: "Donors in 2025",
      value: "1,245",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      delay: 0.2,
    },
    {
      title: "Donors in 2024",
      value: "980",
      icon: Users,
      color: "text-rose-600",
      bg: "bg-rose-100",
      delay: 0.3,
    },
    {
      title: "Donors in 2023",
      value: "850",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
      delay: 0.4,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-xl shadow-red-900/5 border border-red-50 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
            <stat.icon className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h4>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
