import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const STORAGE_KEY = "habits_v3";
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

  const days = getLastNDays(30);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  // Add Habit
  const addHabit = () => {
    if (!name.trim()) {
      toast.error("Habit name cannot be empty!");
      return;
    }

    setHabits([
      ...habits,
      { id: crypto.randomUUID(), name: name.trim(), logs: {} },
    ]);
    toast.success(`Habit "${name}" added!`);
    setName("");
  };

  // Toggle day
  const toggleDay = (habitId, day) => {
    setHabits(
      habits.map((h) =>
        h.id === habitId
          ? { ...h, logs: { ...h.logs, [day]: !h.logs[day] } }
          : h
      )
    );
    const habit = habits.find((h) => h.id === habitId);
    const state = habit?.logs[day] ? "unchecked" : "checked";
    toast(`${habit?.name} for ${day} ${state}`, { icon: "✅" });
  };

  // Delete Habit
  const deleteHabit = (id) => {
    const habit = habits.find((h) => h.id === id);
    setHabits(habits.filter((h) => h.id !== id));
    toast(`Habit "${habit?.name}" deleted`, { icon: "🗑️" });
  };

  return (
    <div className="flex max-w-full mx-auto p-6 gap-6">

      {/* Left: Habit Grid */}
      <div className="overflow-auto flex-1 p-1">
        <header className="space-y-2 my-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Habit Tracker
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Track your habits over the last 30 days. Click on a square to log or
          unlog a habit for that day.
        </p>
      </header>
        <div className="flex gap-3 mb-4 flex-col sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New habit name..."
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
          <button
            onClick={addHabit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition w-full sm:w-auto"
          >
            Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No habits yet. Start with one.
          </p>
        ) : (
          <table className="table-fixed border-collapse border border-gray-300 text-center min-w-[600px] sm:min-w-full">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="border border-gray-300 px-4 py-2 w-48 text-left pl-2 sticky top-0 left-0 bg-gray-100 z-20">
                  Habit
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="border border-gray-300 px-1 py-1 w-8 text-xs sticky top-0 bg-gray-100 z-10"
                  >
                    {day.slice(5)}
                  </th>
                ))}
                <th className="border border-gray-300 px-2 py-1 sticky top-0 bg-gray-100 z-10">
                  Del
                </th>
              </tr>
            </thead>

            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id}>
                  <td className="border border-gray-300 px-2 py-1 font-semibold text-left pl-2 sticky left-0 bg-white z-10">
                    {habit.name}
                  </td>

                  {days.map((day) => (
                    <td key={day} className="border border-gray-300">
                      <button
                        onClick={() => toggleDay(habit.id, day)}
                        className={`w-5 h-5 mx-auto rounded ${
                          habit.logs[day] ? "bg-green-600" : "bg-gray-200"
                        }`}
                        title={day}
                      />
                    </td>
                  ))}

                  <td className="border border-gray-300 px-2 py-1">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
