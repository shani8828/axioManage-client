import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "expense_tracker_data";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [editingId, setEditingId] = useState(null);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("General");
    setDate(new Date().toISOString().slice(0, 10));
    setEditingId(null);
  };

  const addOrUpdateExpense = () => {
    if (!title || !amount) return;

    if (editingId) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, title, amount: Number(amount), category, date }
            : e
        )
      );
    } else {
      setExpenses((prev) => [
        {
          id: Date.now(),
          title,
          amount: Number(amount),
          category,
          date,
        },
        ...prev,
      ]);
    }

    resetForm();
  };

  const editExpense = (e) => {
    setEditingId(e.id);
    setTitle(e.title);
    setAmount(e.amount);
    setCategory(e.category);
    setDate(e.date);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  /* ------------------ ANALYTICS ------------------ */

  const totalAmount = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
  }, [expenses]);

  const maxCategoryValue = Math.max(
    ...Object.values(categoryTotals),
    1
  );

  const monthlyTotals = useMemo(() => {
    return expenses.reduce((acc, e) => {
      const month = e.date.slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + e.amount;
      return acc;
    }, {});
  }, [expenses]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow space-y-8">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Expense Tracker</h2>
        <span className="text-lg font-medium text-green-600">
          Total ₹{totalAmount}
        </span>
      </header>

      {/* Form */}
      <div className="grid md:grid-cols-5 gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Expense title"
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="border rounded px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option>General</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={addOrUpdateExpense}
          className="bg-indigo-600 text-white rounded px-4"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* ------------------ CATEGORY BAR CHART ------------------ */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Category Breakdown</h3>

        <div className="space-y-3">
          {Object.entries(categoryTotals).map(([cat, amt]) => (
            <div key={cat}>
              <div className="flex justify-between text-sm mb-1">
                <span>{cat}</span>
                <span>₹{amt}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded">
                <div
                  className="h-3 bg-indigo-600 rounded transition-all"
                  style={{
                    width: `${(amt / maxCategoryValue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------ MONTHLY TREND ------------------ */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Monthly Spending</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(monthlyTotals).map(([month, amt]) => (
            <div
              key={month}
              className="p-3 border rounded-md text-center"
            >
              <p className="text-sm text-gray-500">{month}</p>
              <p className="text-lg font-semibold">₹{amt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------ LIST ------------------ */}
      <ul className="space-y-3">
        {expenses.map((e) => (
          <li
            key={e.id}
            className="p-3 border rounded-md flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{e.title}</p>
              <p className="text-sm text-gray-500">
                {e.category} • {e.date}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold">₹{e.amount}</span>
              <button
                onClick={() => editExpense(e)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteExpense(e.id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}