import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Tasks", path: "/tasks" },
  { name: "Diary", path: "/diary" },
  { name: "Habit Tracker", path: "/habit-tracker" },
  { name: "Expense Tracker", path: "/expense-tracker" },
  { name: "Contact Book", path: "/contact-book" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600"
    }`;

  return (
    <nav className="block md:hidden sticky top-0 z-50 w-full border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center gap-2">
          <div className="bg-transparent flex items-center justify-center ">
            <div className="text-2xl font-bold">🔥</div>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Axio-Manage
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.path} to={link.path} className={getNavLinkClass}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
          >
            <div className="w-6 h-5 flex flex-col justify-between relative">
              <span className={`h-0.5 w-full bg-current transform transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`h-0.5 w-full bg-current transition-all ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-full bg-current transform transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 ${
          isOpen ? "max-h-96 border-t border-slate-100 dark:border-slate-800" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-2 p-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={getNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}