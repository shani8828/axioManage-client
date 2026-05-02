import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-white bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-2xl font-display font-bold uppercase tracking-widest text-white">
              Axio-<span className="text-[#a8defa]">Manage</span>
            </h3>
            <p className="max-w-md text-sm font-bold text-[#666666] uppercase tracking-widest">
              Organize tasks, habits, expenses, diaries,
              and contacts in one calm, focused workspace. Built for clarity,
              consistency, and momentum.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#111111] bg-[#fcf5bf] inline-block px-2 border-2 border-transparent">
              Product
            </h4>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-widest">
              <li><Link to="/tasks" className="hover:text-[#a8defa] transition-colors">Tasks</Link></li>
              <li><Link to="/habit-tracker" className="hover:text-[#fcf5bf] transition-colors">Habit Tracker</Link></li>
              <li><Link to="/expense-tracker" className="hover:text-[#d0f4e0] transition-colors">Expense Manager</Link></li>
              <li><Link to="/diary" className="hover:text-[#e8c0fc] transition-colors">Personal Diary</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#111111] bg-[#d0f4e0] inline-block px-2 border-2 border-transparent">
              Support
            </h4>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-widest">
              <li><Link to="/contact-book" className="hover:text-[#ff99c8] transition-colors">Contacts Book</Link></li>
              <li><Link to="/attendance" className="hover:text-[#d0f4e0] transition-colors">Attendance</Link></li>
            </ul>
          </div>
        </div>

        <div className="my-12 h-0.5 w-full bg-[#666666]/30" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs font-bold uppercase tracking-widest text-[#666666]">
            © {year} Axio-Manage. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a href="mailto:shani.maurya.iitkgp@gmail.com" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-[#fcf5bf] transition-colors">
              <Mail className="h-5 w-5 stroke-[2px]" />
              Contact
            </a>
            <a href="https://github.com/shani8828" target="_blank" className="text-white hover:text-[#ff99c8] transition-colors">
              <Github className="h-5 w-5 stroke-[2px]" />
            </a>
            <a href="https://www.linkedin.com/in/shani8828/" target="_blank" className="text-white hover:text-[#a8defa] transition-colors">
              <Linkedin className="h-5 w-5 stroke-[2px]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
