import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-indigo-950 via-indigo-950 to-black text-indigo-100">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              Axio-<span className="text-indigo-400">Manage</span>
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-indigo-300">
              Axio-Manage helps you organize tasks, habits, expenses, diaries,
              and contacts in one calm, focused workspace. Built for clarity,
              consistency, and long-term momentum.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/tasks" className="hover:text-white transition">
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="/habit-tracker"
                  className="hover:text-white transition"
                >
                  Habit Tracker
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="hover:text-white transition">
                  Expense Manager
                </Link>
              </li>
              <li>
                <Link to="/diary" className="hover:text-white transition">
                  Personal Diary
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/contact-book"
                  className="hover:text-white transition"
                >
                  Contacts Book
                </Link>
              </li>
              <li>
                <Link to="/cache" className="hover:text-white transition">
                  Cache System
                </Link>
              </li>
              {/* <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Use
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-indigo-700/40 to-transparent" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs text-indigo-400">
            © {year} Axio-Manage. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="mailto:shani.maurya.iitkgp@gmail.com"
              className="group flex items-center gap-2 text-sm text-indigo-300 hover:text-white transition"
            >
              <Mail className="h-4 w-4" />
              Contact
              <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
            </a>

            <a
              href="https://github.com/shani8828"
              target="_blank"
              className="text-indigo-300 hover:text-white transition"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/shani8828/"
              target="_blank"
              className="text-indigo-300 hover:text-white transition"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
