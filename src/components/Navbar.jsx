import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Bell,
  ChevronDown,
  BookText, // Fixed: Added missing icon imports
  Activity,
  Wallet,
  Contact2,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false); // Fixed: Close mobile menu on logout
    setIsProfileOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Tasks", path: "/tasks", icon: LayoutDashboard },
    { name: "Diary", path: "/diary", icon: BookText }, // Fixed: Changed icon for variety
    { name: "Habit Tracker", path: "/habit-tracker", icon: Activity },
    { name: "Expense Tracker", path: "/expense-tracker", icon: Wallet },
    { name: "Contact Book", path: "/contact-book", icon: Contact2 },
    { name: "Cache System", path: "/cache", icon: Contact2 },
    { name: "Attendance", path: "/attendance", icon: Contact2 },
  ];

  return (
    // Fixed: Added transition-all to the nav container for smoother scroll appearance
    <nav className="sticky top-3 rounded-3xl md:rounded-full border mx-2 md:mx-6 lg:mx-10 z-50 border-slate-200 bg-white/40 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-transparent transition-transform group-hover:rotate-12">
                <span className="text-xl font-bold text-white text-[25px]">
                  🔥
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Axio-<span className="text-indigo-600">Manage</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 hover:bg-white transition-all shadow-sm"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        referrerPolicy="no-referrer"
                        className="h-8 w-8 rounded-full object-cover border border-indigo-100"
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}{" "}
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        {/* Overlay to close dropdown */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 z-20 mt-3 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <div className="px-4 py-3 border-b border-slate-50 mb-1">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {user?.name || "Account"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                          {/* <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4" /> Settings
                          </Link> */}
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-3 py-2 mt-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Sign Up
                </Link> */}
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white text-sm px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-white focus:outline-none transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-100 bg-transparent rounded-b-3xl overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Sign out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
