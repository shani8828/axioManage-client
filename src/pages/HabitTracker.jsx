import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Plus,
  Trash2,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CalendarDays,
} from "lucide-react";

const getLastNDays = (n = 30) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

export default function FullHabitDashboard() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const days = getLastNDays(30);
  const today = new Date().toISOString().slice(0, 10);

  const fetchHabits = async () => {
    const t = toast.loading("Loading habits...");
    try {
      const data = await api.get("/habits");
      setHabits(data);
      toast.dismiss(t);
    } catch {
      toast.dismiss(t);
      toast.error("Failed to fetch habits");
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async () => {
    if (!name.trim()) {
      toast.error("Habit name cannot be empty");
      return;
    }

    const t = toast.loading("Saving habit...");
    try {
      const newHabit = await api.post("/habits", { name: name.trim() });
      setHabits([newHabit, ...habits]);
      toast.success(`Habit "${name}" added`, { id: t });
      setName("");
      setIsFormOpen(false);
    } catch {
      toast.error("Failed to add habit", { id: t });
    }
  };

  const toggleDay = async (habitId, day) => {
    const t = toast.loading("Updating...");
    try {
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habitId
            ? { ...h, logs: { ...h.logs, [day]: !h.logs?.[day] } }
            : h,
        ),
      );

      await api.patch(`/habits/${habitId}/toggle`, { day });

      const habit = habits.find((h) => h._id === habitId);
      toast.success(habit?.name || "Updated", {
        id: t,
        duration: 800,
      });
    } catch {
      toast.error("Failed to update", { id: t });
      fetchHabits();
    }
  };

  const deleteHabit = async (habitId) => {
    const habit = habits.find((h) => h._id === habitId);
    const t = toast.loading("Deleting habit...");
    try {
      await api.delete(`/habits/${habitId}`);
      setHabits(habits.filter((h) => h._id !== habitId));
      toast(`Habit "${habit.name}" deleted`, {
        icon: "🗑️",
        id: t,
      });
    } catch {
      toast.error("Failed to delete habit", { id: t });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-orange-500 shadow-lg shadow-orange-500/25">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Axio-Habits
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Consistency over the last 30 days
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-orange-600 transition"
        >
          {isFormOpen ? <ChevronUp /> : <Plus />}
          {isFormOpen ? "Close" : "New Habit"}
        </button>
      </motion.header>

      {/* Add Habit */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl flex flex-col sm:flex-row gap-3">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHabit()}
                placeholder="Habit name"
                className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <button
                onClick={addHabit}
                className="px-8 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-orange-600 transition"
              >
                Create
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heatmap Board */}
      <div className="bg-white w-full rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <div className="min-w-[900px] px-2 py-4 sm:px-4 lg:px-6 sm:py-6 lg:py-8">
            {/* Header row */}
            <div className="flex border-b pb-4 mb-4 text-xs uppercase tracking-widest text-slate-400 font-bold">
              <div className="w-40 md:w-52 flex items-center gap-2 shrink-0 sticky left-0 z-30 bg-white border-r border-slate-200 shadow-sm">
                <CalendarDays className="w-4 h-4" />
                Habits
              </div>
              <div className="flex gap-2 pl-2">
                {days.map((day) => (
                  <div key={day} className="w-6 text-center">
                    <div
                      className={`text-[9px] font-bold ${
                        day === today ? "text-orange-500" : "text-slate-400"
                      }`}
                    >
                      {new Date(day).toLocaleDateString(undefined, {
                        weekday: "narrow",
                      })}
                    </div>
                    <div
                      className={`mt-1 w-5 h-5 mx-auto rounded-md flex items-center justify-center text-[9px] font-black ${
                        day === today
                          ? "bg-orange-500 text-white"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {day.slice(-2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Habit rows */}
            <div className="space-y-3 bg-white">
              {habits.length === 0 && (
                <p className="text-center text-slate-400 py-10 italic">
                  No habits yet. Start with one.
                </p>
              )}

              <AnimatePresence>
                {habits.map((habit) => (
                  <motion.div
                    key={habit._id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 group min-w-full bg-white"
                  >
                    <div className="w-40 md:w-52 shrink-0 flex items-center gap-3 pr-2 sticky left-0 z-20 bg-white border-r border-slate-200 shadow-sm">
                      <div className="w-3 h-3 rounded-lg bg-orange-300 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition">
                        {/* <CheckCircle2 className="w-4 h-4" /> */}
                      </div>
                      <span className="font-semibold text-sm text-slate-700 truncate bg-white">
                        {habit.name}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {days.map((day) => (
                        <button
                          key={day}
                          onClick={() => toggleDay(habit._id, day)}
                          className={`w-6 h-6 rounded-md border transition ${
                            habit.logs?.[day]
                              ? "bg-orange-500 border-orange-600"
                              : "bg-slate-50 border-slate-200 hover:border-slate-400"
                          } ${day === today ? "ring-2 ring-orange-200" : ""}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => deleteHabit(habit._id)}
                      className="ml-auto p-2 opacity-0 group-hover:opacity-100 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t flex flex-wrap gap-4 justify-between items-center text-[10px] uppercase tracking-widest font-bold text-slate-400">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-slate-200 rounded" /> Incomplete
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-orange-500 rounded" /> Complete
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600">
            <Flame className="w-3 h-3" />
            Streak Active
          </div>
        </div>
      </div>
    </section>
  );
}
