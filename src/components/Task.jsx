import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Task({ listId }) {
  const STORAGE_KEY = `mern_tasks_${listId}`;

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      toast.error("Failed to load tasks");
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // create
  const addTask = () => {
    if (!input.trim()) {
      toast.error("Task cannot be empty");
      return;
    }

    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: input.trim(),
        completed: false,
        createdAt: new Date().toLocaleString(),
      },
    ]);

    toast.success("Task added");
    setInput("");
  };

  // toggle done
  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    const task = tasks.find((t) => t.id === id);
    toast.success(task?.completed ? "Task marked pending" : "Task completed");
  };

  // delete
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.success("Task deleted");
  };

  // edit
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const updateTask = () => {
    if (!editingText.trim()) {
      toast.error("Task text cannot be empty");
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingId ? { ...task, text: editingText.trim() } : task
      )
    );

    toast.success("Task updated");
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Add Task */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No tasks in this list.
          </p>
        )}

        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 border rounded-md bg-white dark:bg-slate-800"
          >
            <div className="flex items-center gap-2 sm:w-6">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleDone(task.id)}
                className="mt-1"
              />
            </div>

            {editingId === task.id ? (
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={updateTask}
                    className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full gap-2 sm:gap-4">
                  <div>
                    <p
                      className={`${
                        task.completed
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-gray-800 dark:text-gray-100"
                      } break-words`}
                    >
                      {task.text}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {task.createdAt}
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                    <button
                      onClick={() => startEdit(task)}
                      className="text-xs px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
