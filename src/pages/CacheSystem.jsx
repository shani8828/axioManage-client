import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  Circle,
  GripVertical,
  Calendar as CalIcon,
  BarChart3,
  Settings,
  Moon,
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
    const newHabit = { id: Date.now(), name: newInput, color: "indigo" };
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
    // Simple reverse check for streak
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
      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
        activeTab === id
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col space-y-8">
        <div className="flex items-center space-x-2 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            C
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            CacheFlow
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="todo" icon={CheckCircle2} label="Tasks" />
          <SidebarItem id="habits" icon={CalIcon} label="Habits" />
          <SidebarItem id="stats" icon={BarChart3} label="Insights" />
        </nav>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
            System Status
          </p>
          <div className="flex items-center text-xs text-green-600 font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            LocalStorage Active
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 capitalize">
              {activeTab}
            </h2>
            <p className="text-slate-500">
              Welcome back, here's your progress.
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="p-2 bg-white border border-slate-200 rounded-lg hover:shadow-sm">
              <Sun size={20} />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg hover:shadow-sm">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Tab Content: TODO */}
        {activeTab === "todo" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <form onSubmit={addTodo} className="relative group">
              <input
                type="text"
                placeholder="Add a new task..."
                className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
              />
              <Plus className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500" />
            </form>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {data.todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center p-4 border-b border-slate-50 hover:bg-slate-50/50 group"
                >
                  <button onClick={() => toggleTodo(todo.id)} className="mr-4">
                    {todo.completed ? (
                      <CheckCircle2 className="text-indigo-500" />
                    ) : (
                      <Circle className="text-slate-300" />
                    )}
                  </button>
                  <span
                    className={`flex-1 font-medium ${todo.completed ? "line-through text-slate-400" : "text-slate-700"}`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleStar(todo.id)}>
                      <Star
                        className={
                          todo.starred
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }
                        size={18}
                      />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-slate-300 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {data.todos.length === 0 && (
                <p className="p-10 text-center text-slate-400">
                  All clear! Add a task to begin.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: HABITS */}
        {activeTab === "habits" && (
          <div className="space-y-8">
            <form onSubmit={addHabit} className="flex space-x-4 max-w-md">
              <input
                type="text"
                placeholder="New habit (e.g. Gym)"
                className="flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
              />
              <button className="bg-slate-900 text-white px-6 rounded-xl font-medium hover:bg-slate-800 transition-colors">
                Add
              </button>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Habit Names - Sticky Column */}
              <div className="lg:col-span-3 space-y-4">
                <div className="h-10 mb-2 flex items-end text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                  Habit
                </div>
                {data.habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="h-12 flex items-center justify-between px-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                  >
                    <span className="font-semibold text-slate-700 truncate">
                      {habit.name}
                    </span>
                    <div className="flex items-center text-orange-500 text-xs font-bold">
                      <Flame size={14} className="mr-1" />
                      {calculateStreak(habit.id)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Habit Grid - Scrollable Section */}
              <div className="lg:col-span-9 overflow-x-auto pb-4">
                <div className="flex space-x-1 mb-2">
                  {getDates.map((d) => (
                    <div
                      key={d}
                      className="w-10 text-[10px] font-bold text-slate-400 text-center"
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
                        const isDone = data.habitLogs[dateStr]?.includes(
                          habit.id,
                        );
                        const streak = calculateStreak(habit.id);
                        // Dynamic Opacity based on streak
                        const opacity = isDone
                          ? Math.min(0.3 + streak * 0.1, 1)
                          : 0.05;

                        return (
                          <button
                            key={dateStr}
                            onClick={() => toggleHabitDate(habit.id, dateStr)}
                            style={{
                              backgroundColor: isDone
                                ? `rgba(79, 70, 229, ${opacity})`
                                : undefined,
                            }}
                            className={`w-10 h-10 rounded-lg flex-shrink-0 transition-all border border-slate-100 ${!isDone ? "bg-slate-200/30 hover:bg-slate-200" : "border-indigo-200"}`}
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
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Completion Rate</h3>
              <div className="space-y-6">
                {getDates.slice(-7).map((date) => {
                  const dayTotal = data.habits.length;
                  const dayDone = data.habitLogs[date]?.length || 0;
                  const pct =
                    dayTotal === 0 ? 0 : Math.round((dayDone / dayTotal) * 100);

                  return (
                    <div key={date}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500 font-medium">
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </span>
                        <span className="font-bold text-indigo-600">
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-indigo-900 p-8 rounded-3xl text-white flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Deep Insights</h3>
                <p className="text-indigo-200 text-sm">
                  Your most consistent habit this week was{" "}
                  <strong>"Gym"</strong>. You're in the top 5% of CacheFlow
                  users.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-indigo-800"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={364}
                      strokeDashoffset={364 - 364 * 0.75}
                      className="text-indigo-400"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold">75%</span>
                </div>
              </div>
              <p className="text-center text-xs text-indigo-300 mt-4 tracking-widest uppercase">
                Weekly Goal Progress
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
