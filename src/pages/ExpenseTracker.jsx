import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO";
import { toast } from "sonner";
import api from "../utils/api";
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
  const [type, setType] = useState("out");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchExpenses = async () => {
    try {
      const data = await api.get("/expenses");
      setExpenses(data);
    } catch {
      toast.error("Failed to load expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setType("out");
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
      type,
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
    setType(e.type || "out");
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

  const inflowTotal = useMemo(
    () => expenses.filter(e => e.type === "in").reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const outflowTotal = useMemo(
    () => expenses.filter(e => e.type !== "in").reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const netTotal = inflowTotal - outflowTotal;

  const categoryTotals = useMemo(() => {
    // Breakdown only makes sense for outflows generally
    return expenses.filter(e => e.type !== "in").reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
  }, [expenses]);

  const maxCategoryValue = Math.max(...Object.values(categoryTotals), 1);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <SEO 
        title="Expense Tracker" 
        description="Understand your money with clear visual insights. Track spending and stay in control with Axio-Expense." 
      />
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-opacity duration-300 border-b-2 border-[#111111] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#d0f4e0] text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111]">
            <Wallet className="w-6 h-6 stroke-[2px]" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-widest">
              Axio-Expense
            </h1>
            <p className="text-sm text-[#666666] font-bold uppercase tracking-widest mt-1">
              Track spending. Stay in control.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-[#d0f4e0] border-2 border-[#111111] px-4 py-3 transition-all hover:bg-white cursor-default shadow-[4px_4px_0px_0px_#111]">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#111111]">
                Inflow
              </p>
              <p className="text-xl font-bold text-[#111111]">
                ₹{inflowTotal.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#ff99c8] border-2 border-[#111111] px-4 py-3 transition-all hover:bg-white cursor-default shadow-[4px_4px_0px_0px_#111]">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#111111]">
                Outflow
              </p>
              <p className="text-xl font-bold text-[#111111]">
                ₹{outflowTotal.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#e8c0fc] border-2 border-[#111111] px-4 py-3 transition-all hover:bg-white cursor-default shadow-[4px_4px_0px_0px_#111]">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#111111]">
                Net Effective
              </p>
              <p className="text-xl font-bold text-[#111111]">
                ₹{netTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="bg-[#a8defa] border-2 border-[#111111] transition-all overflow-hidden shadow-[4px_4px_0px_0px_#111]">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full px-6 py-5 flex items-center justify-between hover:bg-white transition-colors border-b-2 border-transparent hover:border-[#111111]"
        >
          <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-[#111111] text-sm">
            <Plus
              className={`w-5 h-5 stroke-[2px] transition-transform ${
                isFormOpen ? "rotate-45 text-[#ff99c8]" : "text-[#111111]"
              }`}
            />
            {editingId ? "EDIT EXPENSE" : "ADD NEW EXPENSE"}
          </div>
          {isFormOpen ? (
            <ChevronUp className="w-5 h-5 text-[#111111] stroke-[2px]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#111111] stroke-[2px]" />
          )}
        </button>

        {isFormOpen && (
          <div className="px-6 py-6 border-t-2 border-[#111111] bg-white transition-opacity duration-300">
            <div className="mb-6 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer border-2 border-[#111111] px-4 py-2 transition-all">
                <input
                  type="radio"
                  name="type"
                  value="in"
                  checked={type === "in"}
                  onChange={() => setType("in")}
                  className="hidden"
                />
                <div className={`w-3 h-3 border-2 border-[#111111] ${type === "in" ? "bg-[#d0f4e0]" : "bg-white"}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">Inflow (Earning)</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer border-2 border-[#111111] px-4 py-2 transition-all">
                <input
                  type="radio"
                  name="type"
                  value="out"
                  checked={type === "out"}
                  onChange={() => setType("out")}
                  className="hidden"
                />
                <div className={`w-3 h-3 border-2 border-[#111111] ${type === "out" ? "bg-[#ff99c8]" : "bg-white"}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">Outflow (Expense)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ENTRY TITLE"
                  className="w-full bg-transparent border-b-2 border-[#666666]/30 py-2 text-[#111111] focus:border-[#111111] outline-none transition-colors uppercase tracking-widest text-sm font-bold placeholder-[#666666]/50"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">
                  Amount
                </label>
                <div className="relative flex items-center border-b-2 border-[#666666]/30 focus-within:border-[#111111] transition-colors">
                  <span className="text-[#111111] font-bold mr-2 pb-2 pt-2">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent py-2 text-[#111111] outline-none font-bold placeholder-[#666666]/50"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#666666]/30 py-2 text-[#111111] focus:border-[#111111] outline-none transition-colors uppercase tracking-widest text-sm font-bold cursor-pointer appearance-none"
                >
                  {[
                    "General",
                    "Food",
                    "Travel",
                    "Shopping",
                    "Bills",
                    "Others",
                  ].map((c) => (
                    <option
                      key={c}
                      value={c}
                      className="text-[#111111] uppercase"
                    >
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#666666]/30 py-2 text-[#111111] focus:border-[#111111] outline-none transition-colors uppercase tracking-widest text-sm font-bold cursor-pointer"
                />
              </div>
            </div>
            <button
              onClick={addOrUpdateExpense}
              className={`w-full py-4 text-[#111111] font-bold uppercase tracking-widest transition-colors border-2 border-[#111111] flex items-center justify-center gap-2 text-sm ${
                type === "in" ? "bg-[#d0f4e0] hover:bg-[#111111] hover:text-white" : "bg-[#ff99c8] hover:bg-[#111111] hover:text-white"
              }`}
            >
              {editingId ? "UPDATE ENTRY" : "SAVE ENTRY"}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Analytics */}
        <aside className="bg-[#fcf5bf] p-6 border-2 border-[#111111] overflow-hidden sticky top-24 shadow-[4px_4px_0px_0px_#111]">
          <div className="flex items-center gap-2 mb-8 border-b-2 border-[#111111] pb-4">
            <PieChart className="w-5 h-5 text-[#111111] stroke-[2px]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111]">
              Outflow Breakdown
            </h3>
          </div>

          <div className="space-y-6">
            {Object.entries(categoryTotals).map(([cat, amt]) => (
              <div key={cat} className="space-y-3 group">
                <div className="flex items-start justify-between gap-3 text-xs font-bold uppercase tracking-widest">
                  <span className="text-[#111111]/70 group-hover:text-[#111111] transition-colors truncate">
                    {cat}
                  </span>
                  <span className="text-[#111111] shrink-0">
                    ₹{amt.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-2 bg-white border border-[#111111] overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min((amt / maxCategoryValue) * 100, 100)}%`,
                    }}
                    className="h-full bg-[#111111] transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* List */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-2 pb-4 border-b-2 border-[#111111] mb-6">
            <Calendar className="w-4 h-4 text-[#111111] stroke-[2px]" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">
              Recent Entries
            </p>
          </div>

          <div className="space-y-4">
            {expenses.length === 0 ? (
              <div className="p-10 border-2 border-[#111111] bg-white text-center shadow-[4px_4px_0px_0px_#111]">
                <p className="text-[#666666] text-sm uppercase tracking-widest font-bold">
                  No entries found.
                </p>
              </div>
            ) : (
              expenses.map((e, idx) => (
                <article
                  key={e._id}
                  className={`bg-white p-5 border-2 border-[#111111] transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_#111] ${
                    e.type === "in" ? "hover:bg-[#d0f4e0]/20" : "hover:bg-[#ff99c8]/10"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-5">
                    <div className={`w-10 h-10 flex items-center justify-center border-2 border-[#111111] shrink-0 transition-colors ${
                      e.type === "in" ? "bg-[#d0f4e0] group-hover:bg-[#a8defa]" : "bg-[#ff99c8] group-hover:bg-[#fcf5bf]"
                    }`}>
                      <IndianRupee className="w-4 h-4 text-[#111111] stroke-[2px]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#111111] uppercase tracking-widest line-clamp-1">
                        {e.title}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-[#666666] mt-2">
                        {e.category} • {new Date(e.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t-2 sm:border-t-0 border-[#111111]/10 pt-4 sm:pt-0">
                    <span className={`text-lg font-bold ${e.type === "in" ? "text-green-700" : "text-red-600"}`}>
                      {e.type === "in" ? "+" : "-"}₹{e.amount.toLocaleString()}
                    </span>
                    <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(e)}
                        className="p-2 text-[#111111] bg-[#a8defa] border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-all"
                      >
                        <Edit3 className="w-4 h-4 stroke-[2px]" />
                      </button>
                      <button
                        onClick={() => deleteExpense(e._id)}
                        className="p-2 text-[#111111] bg-[#ff99c8] border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2px]" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
