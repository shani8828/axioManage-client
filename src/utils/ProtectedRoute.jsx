import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ProtectedRoute() {
  const { user, loading } = useAuth(); // Assuming your context has a loading state

  // 1. Loading State: Show an attractive, branded animation
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-24 h-24 bg-indigo-500 rounded-full"
          />
          
          {/* Spinning Border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full shadow-lg"
          />

          {/* Center Icon */}
          <div className="absolute">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Brand Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col items-center"
        >
          <h2 className="text-xl font-bold text-slate-900 tracking-tight italic">
            Axio<span className="text-indigo-600">Manage</span>
          </h2>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Not logged in → kick out
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in → allow access with a subtle entry animation for the child content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Outlet />
    </motion.div>
  );
}