import { useEffect, useState } from "react";
import Task from "../components/Task";
import { toast } from "react-hot-toast";

const LISTS_KEY = "task_lists_v2";

export default function Tasks() {
  const [lists, setLists] = useState(() => {
    try {
      const saved = localStorage.getItem(LISTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  }, [lists]);

  // Add new list
  const addNewList = () => {
    if (!newListName.trim()) {
      toast.error("List name cannot be empty!");
      return;
    }

    setLists((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newListName.trim(),
        createdAt: new Date().toLocaleString(),
      },
    ]);

    toast.success(`List "${newListName}" added!`);
    setNewListName("");
  };

  // Delete list
  const deleteList = (id) => {
    const deleted = lists.find((l) => l.id === id);
    setLists((prev) => prev.filter((list) => list.id !== id));
    localStorage.removeItem(`mern_tasks_${id}`);
    toast(`List "${deleted.name}" deleted.`, { icon: "🗑️" });
  };

  // Rename list
  const renameList = (id, name) => {
    setLists((prev) =>
      prev.map((list) => (list.id === id ? { ...list, name } : list))
    );
    toast(`List renamed to "${name}"`, { icon: "✏️" });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Task Lists
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Create multiple task lists and manage them independently.
        </p>
      </header>

      {/* Add List */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="e.g. School tasks"
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />
        <button
          onClick={addNewList}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition w-full md:w-auto"
        >
          Add List
        </button>
      </div>

      {lists.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No task lists yet.
        </p>
      )}

      {/* Lists */}
      <div className="space-y-6">
        {lists.map((list) => (
          <div
            key={list.id}
            className="border rounded-xl p-4 bg-gray-50 dark:bg-slate-800 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 relative">
              <input
                value={list.name}
                onChange={(e) => renameList(list.id, e.target.value)}
                className="text-lg sm:text-xl font-semibold bg-transparent border-b focus:outline-none text-gray-900 dark:text-white w-full sm:w-auto truncate"
              />

              <button
                onClick={() => deleteList(list.id)}
                className="text-sm px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition sm:w-auto absolute -top-2 -right-2"
              >
                Delete List
              </button>
            </div>

            <Task listId={list.id} />
          </div>
        ))}
      </div>
    </section>
  );
}