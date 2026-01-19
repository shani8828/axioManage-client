import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ListTodo,
  BookText,
  Activity,
  Wallet,
  Contact2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const apps = [
  {
    name: "Tasks",
    path: "/tasks",
    description: "Plan, prioritize, and complete tasks with clarity.",
    icon: ListTodo,
    color: "from-indigo-500 to-indigo-700",
    shadow: "shadow-indigo-200",
  },
  {
    name: "Diary",
    path: "/diary",
    description: "Capture thoughts, ideas, and reflections privately.",
    icon: BookText,
    color: "from-emerald-500 to-teal-700",
    shadow: "shadow-emerald-200",
  },
  {
    name: "Habit Tracker",
    path: "/habit-tracker",
    description: "Build consistency with daily habit tracking.",
    icon: Activity,
    color: "from-orange-500 to-red-600",
    shadow: "shadow-orange-200",
  },
  {
    name: "Expense Tracker",
    path: "/expense-tracker",
    description: "Understand your money with clear visual insights.",
    icon: Wallet,
    color: "from-blue-500 to-blue-700",
    shadow: "shadow-blue-200",
  },
  {
    name: "Contact Book",
    path: "/contact-book",
    description: "Keep important people organized and searchable.",
    icon: Contact2,
    color: "from-purple-500 to-purple-700",
    shadow: "shadow-purple-200",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-20 md:px-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-24 max-w-4xl text-center space-y-7"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-600">
          <Sparkles className="h-4 w-4" />
          Axio-Manage Workspace
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
          Take control of your day with{" "}
          <span className="text-indigo-600">Axio-Manage</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-slate-600 leading-relaxed">
          One focused space to plan tasks, build habits, manage money, and keep
          your life organized without distraction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {user ? (
            <Link
              to="/tasks"
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              Open Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
              {/* <button className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-bold text-slate-600 hover:bg-slate-50 transition">
                Explore Features
              </button> */}
            </>
          )}
        </div>
      </motion.section>

      {/* Personalized Panel */}
      {user && (
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-28 max-w-6xl"
        >
          <div className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 p-10 text-white shadow-2xl">
            <Sparkles className="absolute -right-24 -top-24 h-72 w-72 opacity-[0.07]" />

            <div className="relative space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold">
                Welcome back, {user?.name || "Achiever"}
              </h2>
              <p className="max-w-xl text-indigo-200 text-lg">
                Your progress is adding up. Stay consistent and keep moving
                forward.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tasks"
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-900 hover:bg-indigo-50 transition"
                >
                  Resume Tasks
                </Link>
                <Link
                  to="/habit-tracker"
                  className="rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-800 transition"
                >
                  View Habits
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Utilities */}
      <section className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-6">
          <h2 className="text-2xl font-bold text-slate-800">Utilities</h2>
          <div className="hidden md:block h-px flex-1 bg-slate-200" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {apps.map((app) => (
            <motion.div key={app.name} variants={itemVariants}>
              <Link
                to={app.path}
                className={`group relative block h-full rounded-3xl bg-gradient-to-br ${app.color} p-8 shadow-xl ${app.shadow} hover:-translate-y-2 hover:shadow-2xl transition`}
              >
                <app.icon className="absolute -bottom-6 -right-6 h-32 w-32 text-white/10 transition group-hover:scale-110" />

                <div className="relative space-y-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                    <app.icon className="h-7 w-7 text-white" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {app.name}
                    </h3>
                    <p className="mt-2 text-sm text-white/80 leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  <div className="text-xs font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition">
                    Open Tool →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why Axio-Manage */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto mt-32 max-w-4xl rounded-[2.75rem] border border-slate-100 bg-white p-12 shadow-sm"
      >
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
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
              className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 font-medium text-slate-700"
            >
              <CheckCircle2 className="h-5 w-5 text-indigo-500" />
              {feature}
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}