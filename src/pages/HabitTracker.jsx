import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../utils/api";
import {
  Activity,
  Plus,
  Trash2,
  Flame,
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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10 min-h-screen bg-white">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#666666]/20 pb-6 transition-opacity duration-300">
        <div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#fcf5bf] border border-[#111111] text-[#111111]">
              <Activity className="w-6 h-6 stroke-[1.5px]" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-widest">
                Axio-Habits
              </h1>
              <p className="text-sm text-[#666666] font-bold uppercase tracking-widest mt-1">
                Track your consistency
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#111111] border border-[#111111] text-white font-bold uppercase tracking-widest hover:bg-[#666666] transition-colors text-sm"
        >
          {isFormOpen ? <ChevronUp className="w-4 h-4 stroke-[1.5px]" /> : <Plus className="w-4 h-4 stroke-[1.5px]" />}
          {isFormOpen ? "CLOSE" : "Add Habit"}
        </button>
      </header>

      {/* Add Habit */}
      {isFormOpen && (
        <div className="border border-[#111111] bg-white p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            placeholder="HABIT NAME"
            className="flex-1 px-4 py-3 bg-transparent border-b-2 border-[#111111] text-sm font-bold text-[#111111] uppercase tracking-widest focus:outline-none placeholder-[#666666]/50"
          />
          <button
            onClick={addHabit}
            className="px-8 py-3 bg-[#111111] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#d0f4e0] hover:text-[#111111] border border-transparent hover:border-[#111111] transition-colors"
          >
            CREATE
          </button>
        </div>
      )}

      {/* Heatmap Board */}
      <div className="bg-white w-full border border-[#111111] overflow-hidden transition-colors hover:border-[#fcf5bf]">
        <div className="overflow-x-auto w-full">
          <div className="min-w-[900px] px-2 py-4 sm:px-4 lg:px-6 sm:py-6 lg:py-8">
            {/* Header row */}
            <div className="flex border-b border-[#666666]/20 pb-4 mb-4 text-xs uppercase tracking-widest text-[#666666] font-bold">
              <div className="w-40 md:w-52 flex items-center gap-2 shrink-0 sticky left-0 z-30 bg-white border-r border-[#666666]/20 pr-4">
                <CalendarDays className="w-4 h-4 stroke-[1.5px]" />
                HABITS
              </div>
              <div className="flex gap-2 pl-2">
                {days.map((day) => (
                  <div key={day} className="w-6 text-center flex flex-col items-center">
                    <div
                      className={`text-[9px] font-bold ${
                        day === today ? "text-[#111111]" : "text-[#666666]"
                      }`}
                    >
                      {new Date(day).toLocaleDateString(undefined, {
                        weekday: "narrow",
                      })}
                    </div>
                    <div
                      className={`mt-1 w-5 h-5 flex items-center justify-center text-[9px] font-bold border ${
                        day === today
                          ? "bg-[#111111] text-white border-[#111111]"
                          : "bg-white text-[#666666] border-transparent"
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
                <p className="text-center text-[#666666] py-10 font-bold uppercase tracking-widest text-sm">
                  No habits yet. Start with one.
                </p>
              )}

              {habits.map((habit) => (
                <div
                  key={habit._id}
                  className="flex items-center gap-2 group min-w-full bg-white transition-opacity"
                >
                  <div className="w-40 md:w-52 shrink-0 flex items-center gap-3 pr-2 sticky left-0 z-20 bg-white border-r border-[#666666]/20">
                    <div className="w-3 h-3 bg-[#fcf5bf] border border-[#111111] flex items-center justify-center group-hover:bg-[#111111] transition-colors">
                    </div>
                    <span className="font-bold text-xs uppercase tracking-widest text-[#111111] truncate bg-white">
                      {habit.name}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {days.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(habit._id, day)}
                        className={`w-6 h-6 border transition-colors ${
                          habit.logs?.[day]
                            ? "bg-green-500 border-[#111111]"
                            : "bg-white border-[#666666]/20 hover:border-[#111111]"
                        } ${day === today ? "ring-1 ring-[#111111] ring-offset-1" : ""}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => deleteHabit(habit._id)}
                    className="ml-auto p-2 opacity-0 group-hover:opacity-100 hover:text-[#ff99c8] text-[#666666] transition-colors border border-transparent hover:border-[#ff99c8]"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5px]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#666666]/20 flex flex-wrap gap-4 justify-between items-center text-[10px] uppercase tracking-widest font-bold text-[#666666]">
          <div className="flex gap-4">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-white border border-[#666666]/20" /> INCOMPLETE
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#111111] border border-[#111111]" /> COMPLETE
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 border border-[#111111] bg-[#fcf5bf] text-[#111111]">
            <Flame className="w-3 h-3 stroke-[1.5px]" />
            Keep STREAK ACTIVE
          </div>
        </div>
      </div>
    </section>
  );
}
