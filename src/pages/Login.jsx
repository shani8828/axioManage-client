import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Install framer-motion
import { Eye, EyeOff, Mail, Lock } from "lucide-react"; // Install lucide-react

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { token, user } = await api.post("/auth/login", {
        email,
        password,
      });
      login(token, user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async (res) => {
    try {
      const { token, user } = await api.post("/auth/google", {
        tokenId: res.credential,
      });
      login(token, user);
      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      toast.error("Google authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl border border-white/20"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200"
          >
            <Lock className="text-white h-6 w-6" />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleEmailLogin}>
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative group">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  disabled
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="flex justify-between items-center mb-1 ml-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled
                  className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled
            // disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-4 bg-white text-gray-400 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full transform transition-all hover:scale-[1.01]">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error("Google login failed")}
              theme="outline"
              shape="pill" // Pill shape looks classier
              width="100%"
            />
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button className="font-semibold text-indigo-600 hover:text-indigo-500">
            Create account
          </button>
        </p>
      </motion.div>
    </div>
  );
}
