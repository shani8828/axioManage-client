import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const STORAGE_KEY = "diary_entries";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Load from cache
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setEntries(saved);
    } catch {
      toast.error("Failed to load diary entries.");
    }
  }, []);

  // Save to cache
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAddOrUpdate = () => {
    if (!text.trim()) {
      toast.error("Please write something before saving.");
      return;
    }

    if (editingId) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingId ? { ...entry, content: text } : entry
        )
      );
      toast.success("Entry updated");
      setEditingId(null);
    } else {
      setEntries((prev) => [
        {
          id: crypto.randomUUID(),
          content: text,
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);
      toast.success("Entry saved");
    }

    setText("");
  };

  const handleEdit = (entry) => {
    setText(entry.content);
    setEditingId(entry.id);
    toast("Editing entry ✏️", { icon: "📝" });
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast.success("Entry deleted");
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Diary</h1>
        <p className="text-gray-500">
          Write freely. Everything stays on this device.
        </p>
      </header>

      {/* Editor */}
      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts..."
          rows={5}
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleAddOrUpdate}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {editingId ? "Update Entry" : "Save Entry"}
        </button>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {entries.length === 0 && (
          <p className="text-gray-500">No diary entries yet. Start writing.</p>
        )}

        {entries.map((entry) => (
          <article
            key={entry.id}
            className="p-4 border rounded-lg bg-white space-y-2"
          >
            <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{entry.date}</span>

              <div className="space-x-3">
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
