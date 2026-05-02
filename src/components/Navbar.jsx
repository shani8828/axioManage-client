import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  BookText,
  Activity,
  Wallet,
  Contact2,
  LayoutDashboard,
  Bell,
  Hexagon
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    setIsProfileOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Tasks", path: "/tasks", icon: LayoutDashboard, color: "hover:bg-[#a8defa]" },
    { name: "Diary", path: "/diary", icon: BookText, color: "hover:bg-[#e8c0fc]" },
    { name: "Habits", path: "/habit-tracker", icon: Activity, color: "hover:bg-[#fcf5bf]" },
    { name: "Expenses", path: "/expense-tracker", icon: Wallet, color: "hover:bg-[#d0f4e0]" },
    { name: "Contacts", path: "/contact-book", icon: Contact2, color: "hover:bg-[#ff99c8]" },
    // { name: "Cache", path: "/cache", icon: LayoutDashboard, color: "hover:bg-[#a8defa]" },
    { name: "Attendance", path: "/attendance", icon: Contact2, color: "hover:bg-[#d0f4e0]" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#111111] text-white transition-all border-b-4 border-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Hexagon className="w-6 h-6 text-[#fcf5bf] stroke-[2px]" />
              <span className="text-xl font-bold text-white font-display uppercase tracking-widest">
                Axio<span className="text-[#a8defa]">-Manage</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-bold transition-colors uppercase tracking-widest ${
                      isActive
                        ? "bg-white text-[#111111]"
                        : `text-white ${link.color} hover:text-[#111111]`
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pr-2 transition-all border border-white hover:bg-white hover:text-[#111111]"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        referrerPolicy="no-referrer"
                        className="h-7 w-7 object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-7 w-7 bg-[#ff99c8] flex items-center justify-center text-[#111111] text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 z-20 mt-2 w-48 bg-white border-2 border-[#111111] p-2 opacity-100 transition-opacity duration-300">
                        <div className="px-3 py-2 border-b-2 border-[#111111] mb-2">
                          <p className="text-sm font-bold text-[#111111] truncate uppercase tracking-widest">
                            {user?.name || "Account"}
                          </p>
                          <p className="text-xs text-[#666666] truncate uppercase tracking-widest mt-1">
                            {user?.email}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-bold uppercase tracking-widest text-[#111111] hover:bg-[#ff99c8] transition-colors"
                        >
                          <LogOut className="w-4 h-4 stroke-[1.5px]" /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="bg-[#fcf5bf] text-[#111111] text-sm px-4 py-2 font-bold uppercase tracking-widest hover:bg-white transition-all border-2 border-[#111111]"
                >
                  GET STARTED
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6 stroke-[1.5px]" />
              ) : (
                <Menu className="h-6 w-6 stroke-[1.5px]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t-2 border-white bg-[#111111] transition-opacity duration-300">
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2 py-3 text-sm font-bold uppercase tracking-widest transition-all border-b border-white/20 ${
                    isActive
                      ? "bg-white text-[#111111]"
                      : `text-white ${link.color} hover:text-[#111111]`
                  }`
                }
              >
                <link.icon className="w-5 h-5 stroke-[1.5px]" />
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 mt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-2 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#ff99c8] hover:text-[#111111] transition-colors"
                >
                  <LogOut className="w-5 h-5 stroke-[1.5px]" /> SIGN OUT
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 bg-[#fcf5bf] text-[#111111] font-bold uppercase tracking-widest"
                >
                  SIGN IN
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
