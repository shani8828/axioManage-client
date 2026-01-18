import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookText,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await api.get("/diary");
      setEntries(data);
    } catch (err) {
      toast.error(err || "Failed to load diary entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAddOrUpdate = async () => {
    if (!text.trim()) {
      toast.error("Please write something before saving.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/diary/${editingId}`, { content: text });
        toast.success("Entry updated");
        setEditingId(null);
      } else {
        await api.post("/diary", { content: text });
        toast.success("Entry saved");
      }
      setText("");
      setIsExpanded(false);
      fetchEntries();
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  const handleEdit = (entry) => {
    setText(entry.content);
    setEditingId(entry._id);
    setIsExpanded(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Editing entry", { icon: "📝" });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/diary/${id}`);
      toast.success("Entry deleted");
      fetchEntries();
    } catch (err) {
      toast.error(err || "Failed to delete entry");
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/25">
            <BookText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
              Axio-Diary
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Private reflections. Clear thoughts. Better days.
            </p>
          </div>
        </div>
      </motion.header>

      {/* Editor */}
      <motion.div
        layout
        className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 overflow-hidden"
      >
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (editingId) {
              setEditingId(null);
              setText("");
            }
          }}
          className="w-full px-6 sm:px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-3 font-semibold text-slate-800">
            {editingId ? (
              <Edit3 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Plus className="w-5 h-5 text-emerald-600" />
            )}
            {editingId ? "Edit reflection" : "New reflection"}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 sm:px-8 pb-8 space-y-5"
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write freely. No pressure. No judgment."
                rows={7}
                className="w-full rounded-2xl bg-slate-50 px-5 py-4 text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddOrUpdate}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? "Update entry" : "Save entry"}
                </button>

                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setText("");
                      setIsExpanded(false);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-200 transition"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Entries */}
      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-20"
            >
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-20 text-center"
            >
              <p className="text-slate-400 font-medium">
                No entries yet. Start with your first thought.
              </p>
            </motion.div>
          ) : (
            entries.map((entry, idx) => (
              <motion.article
                key={entry._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: idx * 0.04 }}
                className="group rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition"
              >
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {entry.content}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
