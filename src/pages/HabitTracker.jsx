import { useEffect, useState } from "react";

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

  const addHabit = () => {
    if (!name.trim()) return;
    setHabits([
      ...habits,
      { id: crypto.randomUUID(), name: name.trim(), logs: {} },
    ]);
    setName("");
  };

  const toggleDay = (habitId, day) => {
    setHabits(
      habits.map((h) =>
        h.id === habitId
          ? { ...h, logs: { ...h.logs, [day]: !h.logs[day] } }
          : h
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  const getStreak = (logs) => {
    const sortedDays = Object.keys(logs)
      .sort((a, b) => b.localeCompare(a))
      .filter((d) => logs[d]);
    if (!sortedDays.length) return 0;

    let streak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const prev = new Date(sortedDays[i - 1]);
      const curr = new Date(sortedDays[i]);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  };

  return (
    <div className="flex max-w-full mx-auto p-6 gap-6">
      {/* Left: Habit Grid */}
      <div className="overflow-auto flex-1">
        <div className="flex gap-3 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New habit name..."
            className="flex-1 border rounded-md px-3 py-2"
          />
          <button
            onClick={addHabit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <p className="text-gray-500">No habits yet. Start with one.</p>
        ) : (
          <table className="table-fixed border-collapse border border-gray-300 text-center">
  <thead>
    <tr className="bg-gray-100 sticky top-0">
      {/* Top-left cell: freeze both row + column */}
      <th
        className="border border-gray-300 px-4 py-2 w-48 text-left pl-2 sticky top-0 left-0 bg-gray-100 z-20"
      >
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

      {/* Delete column header */}
      <th
        className="border border-gray-300 px-2 py-1 sticky top-0 bg-gray-100 z-10"
      >X
      </th>
    </tr>
  </thead>

  <tbody>
    {habits.map((habit) => (
      <tr key={habit.id}>
        {/* First column: freeze left */}
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

        {/* Delete column: optional, can freeze too if you want */}
        <td className="border border-gray-300 px-2 py-1">
          <button
            onClick={() => deleteHabit(habit.id)}
            className="px-2 py-1 bg-red-600 text-white rounded text-sm"
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
