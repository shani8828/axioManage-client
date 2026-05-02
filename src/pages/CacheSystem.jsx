import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  Circle,
  Calendar as CalIcon,
  BarChart3,
  Settings,
  Sun,
  Flame,
} from "lucide-react";

// --- Local Storage Helpers ---
const STORAGE_KEY = "cache_system_data";

const loadData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : { todos: [], habits: [], habitLogs: {} };
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default function CacheSystem() {
  const [data, setData] = useState(loadData);
  const [activeTab, setActiveTab] = useState("todo"); // 'todo' | 'habits' | 'stats'
  const [newInput, setNewInput] = useState("");

  // Sync to localStorage on every change
  useEffect(() => {
    saveData(data);
  }, [data]);

  // --- ToDo Logic ---
  const addTodo = (e) => {
    e.preventDefault();
    if (!newInput.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newInput,
      completed: false,
      starred: false,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, todos: [newItem, ...prev.todos] }));
    setNewInput("");
  };

  const toggleTodo = (id) => {
    setData((prev) => ({
      ...prev,
      todos: prev.todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    }));
  };

  const toggleStar = (id) => {
    setData((prev) => ({
      ...prev,
      todos: prev.todos.map((t) =>
        t.id === id ? { ...t, starred: !t.starred } : t,
      ),
    }));
  };

  const deleteTodo = (id) => {
    setData((prev) => ({
      ...prev,
      todos: prev.todos.filter((t) => t.id !== id),
    }));
  };

  // --- Habit Logic ---
  const addHabit = (e) => {
    e.preventDefault();
    if (!newInput.trim()) return;
    const newHabit = { id: Date.now(), name: newInput, color: "dark" };
    setData((prev) => ({ ...prev, habits: [...prev.habits, newHabit] }));
    setNewInput("");
  };

  const toggleHabitDate = (habitId, dateStr) => {
    setData((prev) => {
      const logs = { ...prev.habitLogs };
      if (!logs[dateStr]) logs[dateStr] = [];

      if (logs[dateStr].includes(habitId)) {
        logs[dateStr] = logs[dateStr].filter((id) => id !== habitId);
      } else {
        logs[dateStr] = [...logs[dateStr], habitId];
      }
      return { ...prev, habitLogs: logs };
    });
  };

  // --- Analytics & Grid Helpers ---
  const getDates = useMemo(() => {
    const dates = [];
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }, []);

  const calculateStreak = (habitId) => {
    let streak = 0;
    const today = new Date().toISOString().split("T")[0];
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      if (data.habitLogs[dStr]?.includes(habitId)) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  // --- Components ---
  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full p-3 transition-colors border border-transparent ${
        activeTab === id
          ? "bg-[#111111] text-white border-[#111111]"
          : "text-[#666666] hover:text-[#111111] hover:border-[#111111]"
      }`}
    >
      <Icon size={20} className="stroke-[1.5px]" />
      <span className="font-bold uppercase tracking-widest text-xs">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#111111] p-6 flex flex-col space-y-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border border-[#111111] bg-[#a8defa] flex items-center justify-center text-[#111111] font-display font-bold">
            C
          </div>
          <h1 className="text-xl font-display font-bold tracking-widest uppercase">
            CacheFlow
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="todo" icon={CheckCircle2} label="Tasks" />
          <SidebarItem id="habits" icon={CalIcon} label="Habits" />
          <SidebarItem id="stats" icon={BarChart3} label="Insights" />
        </nav>

        <div className="border border-[#111111] p-4 bg-transparent">
          <p className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">
            System Status
          </p>
          <div className="flex items-center text-xs text-[#111111] font-bold uppercase tracking-widest">
            <div className="w-2 h-2 bg-[#111111] mr-2" />
            LocalStorage Active
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-[#666666]/20 pb-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-widest">
              {activeTab}
            </h2>
            <p className="text-[#666666] text-sm font-bold uppercase tracking-widest mt-1">
              Welcome back, here's your progress.
            </p>
          </div>
        </header>

        {/* Tab Content: TODO */}
        {activeTab === "todo" && (
          <div className="max-w-3xl space-y-6">
            <form onSubmit={addTodo} className="relative group border-b-2 border-[#666666]/30 focus-within:border-[#111111] transition-colors">
              <input
                type="text"
                placeholder="ADD A NEW TASK..."
                className="w-full p-3 pl-10 bg-transparent text-sm font-bold uppercase tracking-widest placeholder-[#666666]/50 outline-none"
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
              />
              <Plus className="absolute left-2 top-3.5 text-[#666666] group-focus-within:text-[#111111] stroke-[1.5px]" size={18} />
            </form>

            <div className="bg-white border border-[#111111]">
              {data.todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center p-4 border-b border-[#666666]/20 hover:bg-[#666666]/5 transition-colors group"
                >
                  <button onClick={() => toggleTodo(todo.id)} className="mr-4 text-[#111111] hover:text-[#a8defa] transition-colors">
                    {todo.completed ? (
                      <CheckCircle2 size={20} className="stroke-[1.5px]" />
                    ) : (
                      <Circle size={20} className="stroke-[1.5px]" />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm font-bold uppercase tracking-widest ${todo.completed ? "line-through text-[#666666]" : "text-[#111111]"}`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex items-center space-x-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleStar(todo.id)}>
                      <Star
                        className={
                          todo.starred
                            ? "fill-[#fcf5bf] text-[#111111]"
                            : "text-[#666666] hover:text-[#111111]"
                        }
                        size={18}
                        strokeWidth={1.5}
                      />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-[#666666] hover:text-[#ff99c8] transition-colors"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
              {data.todos.length === 0 && (
                <p className="p-10 text-center text-[#666666] font-bold uppercase tracking-widest text-sm">
                  All clear! Add a task to begin.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: HABITS */}
        {activeTab === "habits" && (
          <div className="space-y-8">
            <form onSubmit={addHabit} className="flex space-x-4 max-w-md border-b-2 border-[#666666]/30 focus-within:border-[#111111] transition-colors pb-2">
              <input
                type="text"
                placeholder="NEW HABIT (E.G. GYM)"
                className="flex-1 px-2 py-2 bg-transparent text-sm font-bold uppercase tracking-widest placeholder-[#666666]/50 outline-none"
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
              />
              <button className="bg-[#111111] text-white px-6 font-bold text-xs uppercase tracking-widest hover:bg-[#a8defa] hover:text-[#111111] transition-colors border border-transparent hover:border-[#111111]">
                ADD
              </button>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-3 space-y-4">
                <div className="h-10 mb-2 flex items-end text-[10px] font-bold text-[#666666] uppercase tracking-widest px-2 border-b border-[#666666]/20 pb-2">
                  Habit
                </div>
                {data.habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="h-12 flex items-center justify-between px-4 bg-white border border-[#666666]/20 hover:border-[#111111] transition-colors"
                  >
                    <span className="font-bold text-xs uppercase tracking-widest text-[#111111] truncate">
                      {habit.name}
                    </span>
                    <div className="flex items-center text-[#111111] text-xs font-bold border border-[#111111] bg-[#fcf5bf] px-2 py-1">
                      <Flame size={12} className="mr-1 stroke-[1.5px]" />
                      {calculateStreak(habit.id)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-9 overflow-x-auto pb-4">
                <div className="flex space-x-1 mb-2 border-b border-[#666666]/20 pb-2">
                  {getDates.map((d) => (
                    <div
                      key={d}
                      className="w-10 text-[9px] font-bold text-[#666666] text-center uppercase tracking-widest"
                    >
                      {new Date(d).toLocaleDateString("en-US", {
                        weekday: "narrow",
                      })}
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {data.habits.map((habit) => (
                    <div key={habit.id} className="flex space-x-1 h-12">
                      {getDates.map((dateStr) => {
                        const isDone = data.habitLogs[dateStr]?.includes(habit.id);
                        return (
                          <button
                            key={dateStr}
                            onClick={() => toggleHabitDate(habit.id, dateStr)}
                            className={`w-10 h-10 flex-shrink-0 transition-colors border ${
                              isDone ? "bg-[#111111] border-[#111111]" : "bg-transparent border-[#666666]/20 hover:border-[#111111]"
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: STATS */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-[#111111] transition-all hover:border-[#a8defa]">
              <h3 className="text-xl font-display font-bold mb-6 text-[#111111] uppercase tracking-widest">Completion Rate</h3>
              <div className="space-y-6">
                {getDates.slice(-7).map((date) => {
                  const dayTotal = data.habits.length;
                  const dayDone = data.habitLogs[date]?.length || 0;
                  const pct =
                    dayTotal === 0 ? 0 : Math.round((dayDone / dayTotal) * 100);

                  return (
                    <div key={date}>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                        <span className="text-[#666666]">
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </span>
                        <span className="text-[#111111]">
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-white border border-[#111111] h-3 overflow-hidden">
                        <div
                          className="bg-[#111111] h-full transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111111] p-8 border border-[#111111] text-white flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-display font-bold mb-2 uppercase tracking-widest">Deep Insights</h3>
                <p className="text-[#666666] text-xs font-bold uppercase tracking-widest">
                  Your most consistent habit this week was{" "}
                  <span className="text-white">"Gym"</span>. You're in the top 5% of CacheFlow
                  users.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center border-4 border-[#d0f4e0] bg-[#111111]">
                  <span className="absolute text-2xl font-display font-bold uppercase tracking-widest">75%</span>
                </div>
              </div>
              <p className="text-center text-[10px] text-[#666666] mt-4 tracking-widest uppercase font-bold">
                Weekly Goal Progress
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
