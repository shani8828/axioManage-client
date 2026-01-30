import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, StickyNote, Send, X } from "lucide-react";
import api from "../utils/api";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      const data = await api.get("/notes");
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load notes");
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and content required");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/notes/${editingId}`, { title, content });
        toast.success("Note updated");
        setEditingId(null);
      } else {
        await api.post("/notes", { title, content });
        toast.success("Note added");
      }
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      fetchNotes();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <StickyNote className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Axio-Notes
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Jot down your thoughts and ideas in SQl powered place.
          </p>
          </div>
          
        </header>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 mb-12 border border-slate-100"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <input
                className="text-xl font-medium placeholder:text-slate-300 border-none focus:ring-0 w-full p-0"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full border-none focus:ring-0 text-slate-600 placeholder:text-slate-300 resize-none p-0"
                placeholder="What's on your mind?..."
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                {editingId && (
                    <button 
                        type="button"
                        onClick={() => {setEditingId(null); setTitle(""); setContent("");}}
                        className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                        <X size={16} /> Cancel Edit
                    </button>
                )}
                <div className="ml-auto">
                    <button
                        disabled={loading}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all hover:shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : editingId ? (
                            <><Pencil size={18} /> Update Note</>
                        ) : (
                            <><Plus size={20} /> Create Note</>
                        )}
                    </button>
                </div>
            </div>
          </form>
        </motion.div>

        {/* Grid Layout for Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {notes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-slate-400 w-6 h-6" />
                </div>
                <p className="text-slate-400 font-medium">Your thoughts are waiting for a home.</p>
              </motion.div>
            ) : (
              notes.map((note) => (
                <motion.div
                  layout
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                      {note.content}
                    </p>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(note)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-semibold transition-colors"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-sm font-semibold transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Notes;