import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  PieChart,
  Calendar,
  ChevronDown,
  ChevronUp,
  IndianRupee,
} from "lucide-react";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchExpenses = async () => {
    const toastId = toast.loading("Loading expenses...");
    try {
      const data = await api.get("/expenses");
      setExpenses(data);
      toast.success("Expenses loaded", { id: toastId });
    } catch {
      toast.error("Failed to load expenses", { id: toastId });
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("General");
    setDate(new Date().toISOString().slice(0, 10));
    setEditingId(null);
    setIsFormOpen(false);
  };

  const addOrUpdateExpense = async () => {
    if (!title || !amount) {
      toast.error("Title and amount are required");
      return;
    }

    const toastId = toast.loading(
      editingId ? "Updating expense..." : "Saving expense...",
    );

    const payload = {
      title,
      amount: Number(amount),
      category,
      date,
    };

    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
        toast.success("Expense updated", { id: toastId });
      } else {
        await api.post("/expenses", payload);
        toast.success("Expense added", { id: toastId });
      }
      resetForm();
      fetchExpenses();
    } catch {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const startEdit = (e) => {
    setEditingId(e._id);
    setTitle(e.title);
    setAmount(e.amount);
    setCategory(e.category);
    setDate(
      e.date
        ? new Date(e.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    );
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteExpense = async (id) => {
    const toastId = toast.loading("Deleting expense...");
    try {
      await api.delete(`/expenses/${id}`);
      toast.success("Expense deleted", { id: toastId });
      fetchExpenses();
    } catch {
      toast.error("Failed to delete", { id: toastId });
    }
  };

  const totalAmount = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  );

  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
  }, [expenses]);

  const maxCategoryValue = Math.max(...Object.values(categoryTotals), 1);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/25">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
              Axio-Expense
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Track spending. Stay in control.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-3xl border border-slate-200 px-6 py-4 shadow-lg shadow-slate-200/40">
          <div className="p-2 rounded-full bg-emerald-100">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Total Spent
            </p>
            <p className="text-2xl font-black text-slate-900">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.header>

      {/* Form */}
      <motion.div
        layout
        className="bg-white rounded-lg border border-slate-200 overflow-hidden"
      >
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full px-6 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3 font-semibold text-gray-800">
            <Plus
              className={`w-5 h-5 transition-transform ${
                isFormOpen ? "rotate-45 text-red-500" : "text-gray-500"
              }`}
            />
            {editingId ? "Edit expense" : "Add new expense"}
          </div>
          {isFormOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 md:px-5 py-2 md:py-4 "
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Expense title"
                  className="px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  {[
                    "General",
                    "Food",
                    "Travel",
                    "Shopping",
                    "Bills",
                    "Others",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <button
                onClick={addOrUpdateExpense}
                className="w-full py-3 rounded-lg bg-blue-400 text-white font-semibold hover:bg-blue-500 transition"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Analytics */}
        <section className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-5 h-5 text-blue-500 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Category Breakdown
            </h3>
          </div>

          <div className="space-y-5">
            {Object.entries(categoryTotals).map(([cat, amt]) => (
              <div key={cat} className="space-y-2">
                <div className="flex items-start justify-between gap-3 text-sm font-semibold">
                  <span className="text-slate-600 truncate max-w-[65%]">
                    {cat}
                  </span>
                  <span className="text-slate-900 shrink-0">
                    ₹{amt.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        (amt / maxCategoryValue) * 100,
                        100,
                      )}%`,
                    }}
                    className="h-full bg-gradient-to-r from-blue-400 to-orange-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* List */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Recent expenses
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {expenses.map((e, idx) => (
              <motion.article
                key={e._id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition">
                    <IndianRupee className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{e.title}</p>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      {e.category} • {new Date(e.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-lg font-black text-slate-900">
                    ₹{e.amount.toLocaleString()}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => startEdit(e)}
                      className="p-2 rounded-xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteExpense(e._id)}
                      className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>
      </div>
    </section>
  );
}
