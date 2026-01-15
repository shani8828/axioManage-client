import { NavLink, Link } from "react-router-dom";

// 1. Define nav items outside the component to prevent re-creation on every render
const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Tasks", path: "/tasks" },
  { name: "Diary", path: "/diary" },
  { name: "Habit Tracker", path: "/habit-tracker" },
  { name: "Expense Tracker", path: "/expense-tracker" },
  { name: "Contact Book", path: "/contact-book" },
];

export default function Sidebar() {
  // 2. Extracted the dynamic class logic for cleaner JSX
  const getNavLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md transition ${
      isActive ? "bg-gray-700" : "hover:bg-gray-800"
    }`;

  return (
    <aside className="hidden md:flex md:w-64 md:h-screen md:fixed md:left-0 md:top-0 bg-gray-900 text-white">
      <div className="w-full p-6 flex flex-col gap-6">
        <Link to="/" className="text-xl font-semibold tracking-wide">
        Managing App
        </Link>

        <nav className="flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path} 
              className={getNavLinkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}