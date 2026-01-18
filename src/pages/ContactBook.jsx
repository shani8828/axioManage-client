import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Search,
  Phone,
  Mail,
  FileText,
  User,
  Trash2,
  Edit3,
  Check,
  X,
  Contact2,
} from "lucide-react";

export default function ContactBook() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await api.get("/contacts");
      setContacts(data);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", notes: "" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const saveContact = async () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/contacts/${editingId}`, form);
        toast.success("Contact updated");
      } else {
        await api.post("/contacts", form);
        toast.success("Contact added");
      }
      resetForm();
      fetchContacts();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const deleteContact = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("Contact deleted");
    } catch {
      toast.error("Failed to delete contact");
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email || "",
      notes: c.notes || "",
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="space-y-2">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-rose-600 p-3 shadow-lg shadow-purple-500/30">
              <Contact2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Axio-Contacts
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Organize people you work with and care about, all in one private
                space.
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
          />
        </div>
      </motion.header>

      {/* Form Card */}
      <motion.div
        layout
        className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60"
      >
        <button
          onClick={() => setIsFormOpen((v) => !v)}
          className="flex w-full items-center justify-between px-8 py-6 font-bold text-slate-700 hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            {editingId ? (
              <Edit3 className="h-5 w-5 text-purple-500" />
            ) : (
              <UserPlus className="h-5 w-5 text-purple-500" />
            )}
            {editingId ? "Edit Contact" : "Add New Contact"}
          </div>
          <motion.div animate={{ rotate: isFormOpen ? 180 : 0 }}>
            <X
              className={`h-5 w-5 ${isFormOpen ? "opacity-100" : "opacity-0"}`}
            />
          </motion.div>
        </button>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-8 pb-8"
            >
              <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
                <Input
                  icon={User}
                  label="Full Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  placeholder="John Doe"
                />
                <Input
                  icon={Phone}
                  label="Phone Number"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  placeholder="+91 98765 43210"
                />
                <Input
                  icon={Mail}
                  label="Email Address"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  placeholder="john@email.com"
                />
                <Input
                  icon={FileText}
                  label="Notes"
                  value={form.notes}
                  onChange={(v) => setForm({ ...form, notes: v })}
                  placeholder="Client, colleague, vendor…"
                />
              </div>

              <div className="mt-10 flex gap-3">
                <button
                  onClick={saveContact}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-rose-600 py-3 font-bold text-white shadow-lg shadow-purple-500/30 hover:brightness-110"
                >
                  <Check className="h-5 w-5" />
                  {editingId ? "Update Contact" : "Save Contact"}
                </button>

                {editingId && (
                  <button
                    onClick={resetForm}
                    className="rounded-xl bg-slate-100 px-6 py-3 font-bold text-slate-600 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredContacts.map((c, i) => (
            <motion.div
              key={c._id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: i * 0.04 }}
              className="group flex items-center justify-between rounded-[2.25rem] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-rose-500 text-xl font-black text-white">
                  {c.name[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-slate-800">
                    {c.name}
                  </h3>
                  <div className="mt-1 space-y-0.5 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-purple-400" />
                      {c.phone}
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="h-3 w-3 text-purple-400" />
                        {c.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="ml-3 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => startEdit(c)}
                  className="rounded-xl p-2.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteContact(c._id)}
                  className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="py-14 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block"
          >
            <Contact2 className="h-8 w-8 text-purple-300" />
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* Controlled input */
function Input({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl bg-slate-50 py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  );
}
