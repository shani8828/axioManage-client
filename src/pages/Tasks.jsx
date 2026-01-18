import { useEffect, useState } from "react";
import Task from "../components/Task";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Check, X, ListTodo } from "lucide-react";

export default function Tasks() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchLists = async () => {
    try {
      const data = await api.get("/lists");
      setLists(data);
    } catch {
      toast.error("Failed to fetch task lists");
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const addNewList = async () => {
    if (!newListName.trim()) {
      toast.error("List name cannot be empty");
      return;
    }
    try {
      const newList = await api.post("/lists", { name: newListName.trim() });
      setLists([newList, ...lists]);
      setNewListName("");
      toast.success("New list created");
    } catch {
      toast.error("Failed to create list");
    }
  };

  const deleteList = async (id) => {
    try {
      await api.delete(`/lists/${id}`);
      setLists(lists.filter((l) => l._id !== id));
      toast.success("List deleted");
    } catch {
      toast.error("Failed to delete list");
    }
  };

  const saveRename = async (id) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const updated = await api.patch(`/lists/${id}`, { name: editName });
      setLists(lists.map((l) => (l._id === id ? updated : l)));
      setEditingId(null);
      toast.success("List renamed");
    } catch {
      toast.error("Rename failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/25">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                  Axio-Tasks
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Organize your work into focused lists. Keep momentum without
                  the noise.
                </p>
              </div>
            </div>
          </div>

          {/* Create List */}
          <div className="flex w-full max-w-sm items-center gap-2 rounded-2xl ">
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Create a new task list"
              className="flex-1 bg-transparent border focus:shadow-sm rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
              onKeyDown={(e) => e.key === "Enter" && addNewList()}
            />
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={addNewList}
              className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-md transition hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.header>

        {/* Lists */}
        <div className="space-y-10">
          <AnimatePresence mode="popLayout">
            {lists.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/70 py-24 text-center backdrop-blur"
              >
                <p className="text-sm font-medium text-slate-400">
                  No task lists yet. Start by creating one above.
                </p>
              </motion.div>
            ) : (
              lists.map((list, index) => (
                <motion.div
                  key={list._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: index * 0.04 }}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/40"
                >
                  {/* List Header */}
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
                    {editingId === list._id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => saveRename(list._id)}
                          className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="group flex flex-1 items-center justify-between">
                        <h2 className="truncate text-xl font-bold text-slate-800">
                          {list.name}
                        </h2>
                        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setEditingId(list._id);
                              setEditName(list.name);
                            }}
                            className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteList(list._id)}
                            className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tasks */}
                  <div className="p-6">
                    <Task
                      listId={list._id}
                      tasks={list.tasks}
                      setTasks={(newTasks) =>
                        setLists((prev) =>
                          prev.map((l) =>
                            l._id === list._id ? { ...l, tasks: newTasks } : l,
                          ),
                        )
                      }
                    />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
