import { useEffect, useState, useRef } from "react";
import SEO from "../components/SEO";
import { toast } from "sonner";
import api from "../utils/api";
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

const DiaryEntry = ({ entry, handleEdit, handleDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > contentRef.current.clientHeight) {
        setShowReadMore(true);
      }
    }
  }, [entry.content]);

  return (
    <article className="group bg-white p-6 sm:p-8 border-2 border-[#111111] hover:shadow-[6px_6px_0px_0px_#111] hover:-translate-y-1 hover:-translate-x-1 transition-all">
      <div className="relative">
        <p
          ref={contentRef}
          className={`text-[#111111] leading-relaxed whitespace-pre-wrap text-base ${
            isExpanded ? "" : "line-clamp-5"
          }`}
        >
          {entry.content}
        </p>
        {showReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-[11px] font-bold uppercase tracking-widest text-[#111111] hover:text-[#ff99c8] transition-colors border-b-2 border-[#111111] pb-0.5 inline-block"
          >
            {isExpanded ? "READ LESS" : "READ MORE"}
          </button>
        )}
      </div>

      <div className="mt-8 pt-6 border-t-2 border-[#111111]/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-[#111111]/70 bg-[#fcf5bf] px-3 py-1 border-2 border-[#111111]">
          <Calendar className="w-4 h-4 stroke-[2px] text-[#111111]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">
            {new Date(entry.createdAt).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleEdit(entry)}
            className="p-2 bg-[#a8defa] text-[#111111] hover:bg-[#111111] hover:text-white transition-all border-2 border-[#111111]"
          >
            <Edit3 className="w-4 h-4 stroke-[2px]" />
          </button>
          <button
            onClick={() => handleDelete(entry._id)}
            className="p-2 bg-[#ff99c8] text-[#111111] hover:bg-[#111111] hover:text-white transition-all border-2 border-[#111111]"
          >
            <Trash2 className="w-4 h-4 stroke-[2px]" />
          </button>
        </div>
      </div>
    </article>
  );
};

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
      toast.error(err?.response?.data?.message || "Failed to load diary entries");
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

    const toastId = toast.loading(
      editingId ? "Updating entry..." : "Saving entry...",
    );

    try {
      if (editingId) {
        await api.put(`/diary/${editingId}`, { content: text });
        toast.success("Entry updated", { id: toastId });
        setEditingId(null);
      } else {
        await api.post("/diary", { content: text });
        toast.success("Entry saved", { id: toastId });
      }
      setText("");
      setIsExpanded(false);
      fetchEntries();
    } catch (err) {
      toast.error(err || "Something went wrong", { id: toastId });
    }
  };

  const handleEdit = (entry) => {
    setText(entry.content);
    setEditingId(entry._id);
    setIsExpanded(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting entry...");
    try {
      await api.delete(`/diary/${id}`);
      toast.success("Entry deleted", { id: toastId });
      fetchEntries();
    } catch (err) {
      toast.error(err || "Failed to delete entry", { id: toastId });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <SEO 
        title="Diary" 
        description="Capture your thoughts, ideas, and reflections privately with Axio-Diary." 
      />
      {/* Header */}
      <header className="flex flex-col gap-4 border-b-2 border-[#111111] pb-6 transition-opacity duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#ff99c8] text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111]">
            <BookText className="w-6 h-6 stroke-[2px]" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-widest">
              Axio-Diary
            </h1>
            <p className="text-[#666666] text-sm font-bold uppercase tracking-widest mt-1">
              Private reflections. Clear thoughts.
            </p>
          </div>
        </div>
      </header>

      {/* Editor */}
      <div className="bg-[#e8c0fc] border-2 border-[#111111] transition-all overflow-hidden shadow-[6px_6px_0px_0px_#111]">
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (editingId) {
              setEditingId(null);
              setText("");
            }
          }}
          className="w-full px-6 py-5 flex items-center justify-between hover:bg-white transition-colors border-b-2 border-transparent hover:border-[#111111]"
        >
          <div className="flex items-center gap-3 font-bold text-[#111111] uppercase tracking-widest text-sm">
            {editingId ? (
              <Edit3 className="w-5 h-5 stroke-[2px]" />
            ) : (
              <Plus className="w-5 h-5 stroke-[2px]" />
            )}
            {editingId ? "EDIT REFLECTION" : "NEW REFLECTION"}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[#111111] stroke-[2px]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#111111] stroke-[2px]" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 pt-2 border-t-2 border-[#111111] bg-white transition-opacity duration-300 space-y-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="WRITE FREELY..."
              rows={7}
              className="w-full bg-transparent border-b-2 border-[#111111] px-2 py-4 text-[#111111] focus:bg-[#e8c0fc]/10 focus:outline-none resize-none transition-colors font-medium text-base"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddOrUpdate}
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-[#111111] bg-[#111111] py-3 font-bold text-white uppercase tracking-widest hover:bg-[#ff99c8] hover:text-[#111111] transition-colors text-sm"
              >
                <Save className="w-4 h-4 stroke-[2px]" />
                {editingId ? "UPDATE ENTRY" : "SAVE ENTRY"}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setText("");
                    setIsExpanded(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#111111] bg-white px-8 py-3 font-bold text-[#111111] uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors text-sm"
                >
                  <X className="w-4 h-4 stroke-[2px]" />
                  CANCEL
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Entries */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-[4px] border-[#111111] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="border-2 border-[#111111] bg-[#fcf5bf] py-20 text-center shadow-[4px_4px_0px_0px_#111]">
            <p className="text-[#111111] font-bold uppercase tracking-widest text-sm">
              NO ENTRIES YET. START WITH YOUR FIRST THOUGHT.
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <DiaryEntry 
              key={entry._id} 
              entry={entry} 
              handleEdit={handleEdit} 
              handleDelete={handleDelete} 
            />
          ))
        )}
      </div>
    </section>
  );
}
