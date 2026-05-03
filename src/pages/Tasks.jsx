import { useEffect, useState } from "react";
import Task from "../components/Task";
import { toast } from "sonner";
import api from "../utils/api";
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

    const t = toast.loading("Creating list...");
    try {
      const newList = await api.post("/lists", { name: newListName.trim() });
      setLists([newList, ...lists]);
      setNewListName("");
      toast.success("New list created", { id: t });
    } catch {
      toast.error("Failed to create list", { id: t });
    }
  };

  const deleteList = async (id) => {
    const t = toast.loading("Deleting list...");
    try {
      await api.delete(`/lists/${id}`);
      setLists(lists.filter((l) => l._id !== id));
      toast.success("List deleted", { id: t });
    } catch {
      toast.error("Failed to delete list", { id: t });
    }
  };

  const saveRename = async (id) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }

    const t = toast.loading("Saving changes...");
    try {
      const updated = await api.patch(`/lists/${id}`, { name: editName });
      setLists(lists.map((l) => (l._id === id ? updated : l)));
      setEditingId(null);
      toast.success("List renamed", { id: t });
    } catch {
      toast.error("Rename failed", { id: t });
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-20">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between transition-opacity duration-300 border-b-2 border-[#111111] pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#a8defa] text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111]">
                <ListTodo className="w-6 h-6 stroke-[2px]" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-widest">
                  Axio-Task
                </h1>
                <p className="text-[#666666] text-sm font-bold uppercase tracking-widest mt-1">
                  Organize your work into focused lists.
                </p>
              </div>
            </div>
          </div>

          {/* Create List */}
          <div className="flex w-full max-w-sm items-center gap-2 border-b-2 border-[#666666]/30 focus-within:border-[#111111] transition-colors">
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="CREATE NEW TASK LIST"
              className="flex-1 bg-transparent px-2 py-2 text-sm font-bold text-[#111111] placeholder-[#666666]/50 focus:outline-none uppercase tracking-widest"
              onKeyDown={(e) => e.key === "Enter" && addNewList()}
            />
            <button
              onClick={addNewList}
              className="p-2 text-[#111111] hover:text-[#a8defa] transition-colors border border-transparent hover:border-[#111111]"
            >
              <Plus className="h-5 w-5 stroke-[1.5px]" />
            </button>
          </div>
        </header>

        {/* Lists */}
        <div className="space-y-8">
          {lists.length === 0 ? (
            <div className="border border-[#666666]/20 bg-transparent py-24 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-[#666666]">
                No task lists yet. Start by creating one above.
              </p>
            </div>
          ) : (
            lists.map((list) => (
              <div
                key={list._id}
                className="overflow-hidden border border-[#666666]/20 bg-white hover:border-[#111111] transition-colors"
              >
                {/* List Header */}
                <div className="flex items-center justify-between gap-4 border-b border-[#666666]/10 bg-transparent px-6 py-5">
                  {editingId === list._id ? (
                    <div className="flex flex-1 items-center gap-3">
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 bg-transparent border-b-2 border-[#111111] px-2 py-1 text-sm font-bold text-[#111111] uppercase tracking-widest focus:outline-none"
                      />
                      <button
                        onClick={() => saveRename(list._id)}
                        className="p-2 text-[#111111] hover:text-[#d0f4e0] transition-colors border border-transparent hover:border-[#111111]"
                      >
                        <Check className="h-4 w-4 stroke-[1.5px]" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-[#111111] hover:text-[#ff99c8] transition-colors border border-transparent hover:border-[#111111]"
                      >
                        <X className="h-4 w-4 stroke-[1.5px]" />
                      </button>
                    </div>
                  ) : (
                    <div className="group flex flex-1 items-center justify-between">
                      <h2 className="truncate text-lg font-bold text-[#111111] uppercase tracking-widest">
                        {list.name}
                      </h2>
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setEditingId(list._id);
                            setEditName(list.name);
                          }}
                          className="p-2 text-[#666666] hover:text-[#111111] transition-colors border border-transparent hover:border-[#111111]"
                        >
                          <Edit2 className="h-4 w-4 stroke-[1.5px]" />
                        </button>
                        <button
                          onClick={() => deleteList(list._id)}
                          className="p-2 text-[#666666] hover:text-[#ff99c8] transition-colors border border-transparent hover:border-[#ff99c8]"
                        >
                          <Trash2 className="h-4 w-4 stroke-[1.5px]" />
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
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
