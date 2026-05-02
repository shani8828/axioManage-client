import { Link } from "react-router-dom";
import {
  ListTodo,
  BookText,
  Activity,
  Wallet,
  Contact2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Hexagon
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const apps = [
  {
    name: "Tasks",
    path: "/tasks",
    description: "Plan, prioritize, and complete tasks with clarity.",
    icon: ListTodo,
    bg: "bg-[#a8defa]",
  },
  {
    name: "Diary",
    path: "/diary",
    description: "Capture thoughts, ideas, and reflections privately.",
    icon: BookText,
    bg: "bg-[#d0f4e0]",
  },
  {
    name: "Habit Tracker",
    path: "/habit-tracker",
    description: "Build consistency with daily habit tracking.",
    icon: Activity,
    bg: "bg-[#fcf5bf]",
  },
  {
    name: "Expense Tracker",
    path: "/expense-tracker",
    description: "Understand your money with clear visual insights.",
    icon: Wallet,
    bg: "bg-[#e8c0fc]",
  },
  {
    name: "Contact Book",
    path: "/contact-book",
    description: "Keep important people organized and searchable.",
    icon: Contact2,
    bg: "bg-[#ff99c8]",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white px-5 py-20 md:px-10 md:container mx-auto">
      {/* Hero */}
      <section className="mx-auto mb-24 max-w-4xl text-center space-y-7 transition-opacity duration-300">
        <div className="inline-flex items-center gap-2 border-2 border-[#111111] bg-[#fcf5bf] px-4 py-1.5 text-sm font-bold text-[#111111] uppercase tracking-widest shadow-[4px_4px_0px_0px_#111]">
          <Hexagon className="h-4 w-4 stroke-[2px]" />
          Axio-Manage Workspace
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold text-[#111111] uppercase tracking-widest leading-tight">
          Take control of your day with <br />
          <span className="text-[#666666]">Axio-Manage</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-[#666666] font-medium">
          One focused space to plan tasks, build habits, manage money, and keep
          your life organized without distraction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {user ? (
            <Link
              to="/tasks"
              className="flex items-center justify-center gap-2 border-2 border-[#111111] bg-[#a8defa] px-8 py-4 font-bold text-[#111111] uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors text-sm shadow-[4px_4px_0px_0px_#111]"
            >
              Open Dashboard
              <ArrowRight className="h-5 w-5 stroke-[2px]" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 border-2 border-[#111111] bg-[#fcf5bf] px-8 py-4 font-bold text-[#111111] uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors text-sm shadow-[4px_4px_0px_0px_#111]"
            >
              Get Started
            </Link>
          )}
        </div>
      </section>

      {/* Personalized Panel */}
      {user && (
        <section className="mb-28 transition-opacity duration-300">
          <div className="mx-2 md:mx-0 border border-[#666666]/20 bg-white p-6 md:p-10 transition-all hover:border-[#111111]">
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-[#111111] uppercase tracking-widest">
                Welcome back, {user?.name || "Achiever"}
              </h2>
              <p className="max-w-xl text-[#666666] text-sm md:text-base font-bold uppercase tracking-widest">
                Your progress is adding up. Stay consistent and keep moving forward.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/tasks"
                  className="border border-[#111111] px-6 py-3 text-sm font-bold text-[#111111] uppercase tracking-widest hover:bg-[#a8defa]/20 transition-colors"
                >
                  RESUME TASKS
                </Link>
                <Link
                  to="/habit-tracker"
                  className="border border-[#111111] bg-[#111111] px-6 py-3 text-sm font-bold text-white uppercase tracking-widest hover:bg-[#666666] transition-colors"
                >
                  VIEW HABITS
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Utilities */}
      <section className="mx-auto max-w-6xl transition-opacity duration-300">
        <div className="mb-12 flex items-center gap-6 border-b border-[#666666]/20 pb-4">
          <h2 className="text-2xl font-display font-bold text-[#111111] uppercase tracking-widest">Utilities</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <Link
              key={app.name}
              to={app.path}
              className={`group block border-2 border-[#111111] ${app.bg} p-8 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#111] transition-all`}
            >
              <div className="space-y-6">
                <div className={`flex h-12 w-12 items-center justify-center border-2 border-[#111111] bg-white`}>
                  <app.icon className="h-6 w-6 text-[#111111] stroke-[1.5px]" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#111111] uppercase tracking-widest">
                    {app.name}
                  </h3>
                  <p className="mt-3 text-sm text-[#666666] font-medium">
                    {app.description}
                  </p>
                </div>

                <div className="text-xs font-bold uppercase tracking-widest text-[#111111] opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Tool →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Axio-Manage */}
      <section className="mx-auto mt-32 max-w-4xl border-2 border-[#111111] bg-[#d0f4e0] p-10 md:p-14 transition-all shadow-[8px_8px_0px_0px_#111]">
        <h2 className="mb-12 text-center text-2xl font-display font-bold text-[#111111] uppercase tracking-widest">
          Why Axio-Manage works
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            "Clear daily task planning",
            "Private and secure journaling",
            "Visible habit streaks and progress",
            "Financial clarity through charts",
            "Instant access to contacts",
          ].map((feature, i) => (
             <div
               key={i}
               className="flex items-center gap-3 border-b border-[#666666]/10 pb-4 text-sm font-bold text-[#111111] uppercase tracking-widest"
             >
               <CheckCircle2 className="h-5 w-5 text-[#111111] stroke-[1.5px]" />
               {feature}
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}
