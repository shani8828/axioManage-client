import { useState } from "react";
import { toast } from "sonner";
import api from "../utils/api";
import { Trash2, Edit3, Check, X, Plus, Calendar } from "lucide-react";

export default function Task({ listId, tasks, setTasks }) {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const addTask = async () => {
    if (!input.trim()) return toast.error("Task cannot be empty");
    const toastId = toast.loading("Saving task...");
    try {
      const newTask = await api.post(`/lists/${listId}/tasks`, {
        text: input.trim(),
      });
      setTasks([...(tasks || []), newTask]);
      setInput("");
      toast.success("Task added", { id: toastId });
    } catch {
      toast.error("Failed to add task", { id: toastId });
    }
  };

  const toggleDone = async (taskId, completed) => {
    const toastId = toast.loading("Updating status...");
    try {
      const updatedTask = await api.patch(`/lists/${listId}/tasks/${taskId}`, {
        completed: !completed,
      });
      setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
      toast.success("Status updated", { id: toastId });
    } catch {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  const updateTask = async () => {
    if (!editingText.trim()) return toast.error("Task cannot be empty");
    const toastId = toast.loading("Updating task...");
    try {
      const updatedTask = await api.patch(`/lists/${listId}/tasks/${editingId}`, {
        text: editingText,
      });
      setTasks(tasks.map((t) => (t._id === editingId ? updatedTask : t)));
      setEditingId(null);
      toast.success("Task updated", { id: toastId });
    } catch {
      toast.error("Failed to update task", { id: toastId });
    }
  };

  const deleteTask = async (taskId) => {
    const toastId = toast.loading("Deleting task...");
    try {
      await api.delete(`/lists/${listId}/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success("Task deleted", { id: toastId });
    } catch {
      toast.error("Failed to delete task", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Input Field */}
      <div className="flex items-center gap-2 group border-b-2 border-[#666666]/30 focus-within:border-[#111111] transition-colors pb-2">
        <div className="relative flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="WHAT NEEDS TO BE DONE?"
            className="w-full bg-transparent px-2 py-2 text-sm font-bold text-[#111111] placeholder-[#666666]/50 focus:outline-none uppercase tracking-widest"
          />
        </div>
        <button
          onClick={addTask}
          className="p-2 text-[#111111] hover:text-[#a8defa] transition-colors border border-transparent hover:border-[#111111]"
        >
          <Plus className="w-5 h-5 stroke-[1.5px]" />
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm font-bold uppercase tracking-widest text-[#666666]">
              No tasks yet. Stay productive!
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <li
              key={task._id}
              className={`group flex items-start gap-4 p-3 transition-colors border ${
                task.completed
                  ? "bg-[#666666]/5 border-[#666666]/10"
                  : "bg-white border-[#666666]/20 hover:border-[#111111]"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleDone(task._id, task.completed)}
                className={`mt-1 w-5 h-5 flex shrink-0 items-center justify-center transition-colors border ${
                  task.completed
                    ? "bg-[#111111] border-[#111111]"
                    : "border-[#666666] hover:border-[#111111]"
                }`}
              >
                {task.completed && (
                  <Check className="w-3 h-3 text-white stroke-[2px]" />
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                {editingId === task._id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 bg-transparent border-b-2 border-[#111111] px-2 py-1 text-sm font-bold text-[#111111] uppercase tracking-widest focus:outline-none"
                    />
                    <button
                      onClick={updateTask}
                      className="p-1 text-[#111111] hover:text-[#d0f4e0] transition-colors"
                    >
                      <Check className="w-4 h-4 stroke-[1.5px]" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-[#111111] hover:text-[#ff99c8] transition-colors"
                    >
                      <X className="w-4 h-4 stroke-[1.5px]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold uppercase tracking-widest break-words ${
                        task.completed
                          ? "text-[#666666] line-through"
                          : "text-[#111111]"
                      }`}
                    >
                      {task.text}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#666666] mt-2">
                      <Calendar className="w-3 h-3 stroke-[1.5px]" />
                      {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {!editingId && (
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingId(task._id);
                      setEditingText(task.text);
                    }}
                    className="p-1 text-[#666666] hover:text-[#111111] transition-colors"
                  >
                    <Edit3 className="w-4 h-4 stroke-[1.5px]" />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="p-1 text-[#666666] hover:text-[#ff99c8] transition-colors"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5px]" />
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}