import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, ArrowUpRight, Users } from "lucide-react";
import api from "../utils/api";

export default function Footer() {
  const year = new Date().getFullYear();
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const res = await api.get("/visitor", { skipCache: true });
        if (res && res.count !== undefined) {
          setVisitorCount(res.count);
        }
      } catch (err) {
        console.error("Failed to fetch visitor count", err);
      }
    };
    fetchVisitorCount();
  }, []);

  return (
    <footer className="border-t-4 border-white bg-[#111111] text-white w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Main Grid: 1 col on small, 2 cols on md+ */}
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2">
          {/* Left Column: Title and Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold uppercase tracking-widest text-white">
              Axio-<span className="text-[#a8defa]">Manage</span>
            </h3>
            <p className="max-w-md text-sm font-bold text-[#666666] uppercase tracking-widest">
              Organize tasks, habits, expenses, diaries, and contacts in one
              calm, focused workspace. Built for clarity, consistency, and
              momentum.
            </p>
          </div>

          {/* Right Column: Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#111111] bg-[#fcf5bf] inline-block px-2 border-2 border-transparent">
              Services
            </h4>
            {/* Services Grid: Always 2 columns for elements */}
            <ul className="text-sm font-bold uppercase tracking-widest grid grid-cols-2 gap-4">
              <li>
                <Link
                  to="/tasks"
                  className="hover:text-[#a8defa] transition-colors"
                >
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="/habit-tracker"
                  className="hover:text-[#fcf5bf] transition-colors"
                >
                  Habit Tracker
                </Link>
              </li>
              <li>
                <Link
                  to="/expense-tracker"
                  className="hover:text-[#d0f4e0] transition-colors"
                >
                  Expense Manager
                </Link>
              </li>
              <li>
                <Link
                  to="/diary"
                  className="hover:text-[#e8c0fc] transition-colors"
                >
                  Personal Diary
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-book"
                  className="hover:text-[#ff99c8] transition-colors"
                >
                  Contacts Book
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-12 h-0.5 w-full bg-[#666666]/30" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs font-bold uppercase tracking-widest text-[#666666]">
            © {year} Ayodhya Serenity | All rights reserved.
          </p>

          {/* Visitor Count Box */}
          {visitorCount !== null && (
            <div className="flex items-center gap-2 border-2 border-[#666666] bg-[#111111] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_#666666]">
              <Users className="h-4 w-4 text-[#fcf5bf] stroke-[2px]" />
              Visitor No. <span className="text-[#a8defa]">{visitorCount}</span>
            </div>
          )}

          <div className="flex items-center gap-5">
            <a
              href="mailto:info.ayodhyaserenity@gmail.com"
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-[#fcf5bf] transition-colors"
            >
              <Mail className="h-5 w-5 stroke-[2px]" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
