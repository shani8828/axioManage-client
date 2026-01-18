import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit3, Check, X, Plus, Calendar } from "lucide-react";

export default function Task({ listId, tasks, setTasks }) {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const addTask = async () => {
    if (!input.trim()) return toast.error("Task cannot be empty");
    try {
      const newTask = await api.post(`/lists/${listId}/tasks`, {
        text: input.trim(),
      });
      setTasks([...(tasks || []), newTask]);
      setInput("");
      toast.success("Task added");
    } catch {
      toast.error("Failed to add task");
    }
  };

  const toggleDone = async (taskId, completed) => {
    try {
      const updatedTask = await api.patch(`/lists/${listId}/tasks/${taskId}`, {
        completed: !completed,
      });
      setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    } catch {
      toast.error("Failed to update status");
    }
  };

  const updateTask = async () => {
    if (!editingText.trim()) return toast.error("Task cannot be empty");
    try {
      const updatedTask = await api.patch(`/lists/${listId}/tasks/${editingId}`, {
        text: editingText,
      });
      setTasks(tasks.map((t) => (t._id === editingId ? updatedTask : t)));
      setEditingId(null);
      toast.success("Task updated");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/lists/${listId}/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Input Field */}
      <div className="flex items-center gap-2 group">
        <div className="relative flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="What needs to be done?"
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTask}
          className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        <AnimatePresence mode="popLayout">
          {(!tasks || tasks.length === 0) ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-6"
            >
              <p className="text-sm text-gray-400 italic">No tasks yet. Stay productive!</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <motion.li
                key={task._id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  task.completed 
                    ? "bg-gray-50/50 border-gray-100" 
                    : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Custom Checkbox */}
                <button
                  onClick={() => toggleDone(task._id, task.completed)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed 
                    ? "bg-green-500 border-green-500" 
                    : "border-gray-300 hover:border-indigo-500"
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 text-white" />}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  {editingId === task._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="flex-1 bg-white border border-indigo-300 rounded-lg px-2 py-1 text-sm outline-none ring-2 ring-indigo-500/10"
                      />
                      <button onClick={updateTask} className="p-1 text-green-600 hover:bg-green-50 rounded-md">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded-md">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium transition-all truncate ${
                        task.completed ? "text-gray-400 line-through" : "text-gray-700"
                      }`}>
                        {task.text}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!editingId && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingId(task._id); setEditingText(task.text); }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}