import { useEffect, useState } from "react";

const STORAGE_KEY = "contact_book_data";

export default function ContactBook() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", notes: "" });
    setEditingId(null);
  };

  const saveContact = () => {
    if (!form.name || !form.phone) return;

    if (editingId) {
      setContacts(prev =>
        prev.map(c => (c.id === editingId ? { ...c, ...form } : c))
      );
    } else {
      setContacts(prev => [{ id: Date.now(), ...form }, ...prev]);
    }

    resetForm();
  };

  const editContact = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, phone: c.phone, email: c.email, notes: c.notes });
  };

  const deleteContact = (id) => setContacts(prev => prev.filter(c => c.id !== id));

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl shadow space-y-6">
      {/* Header + Search */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Contact Book</h2>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </header>

      {/* Form */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="flex-1 min-w-[120px] border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="flex-1 min-w-[120px] border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="flex-1 min-w-[120px] border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="flex-1 min-w-[120px] border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={saveContact}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition w-full sm:w-auto"
      >
        {editingId ? "Update Contact" : "Add Contact"}
      </button>

      {/* Contact List */}
      <ul className="space-y-3">
        {filteredContacts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No contacts found.</p>
        )}

        {filteredContacts.map((c) => (
          <li
            key={c.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-md bg-gray-50 dark:bg-slate-700"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{c.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-300 truncate">
                {c.phone} {c.email && `• ${c.email}`}
              </p>
              {c.notes && <p className="text-xs text-gray-400 dark:text-gray-400 truncate">{c.notes}</p>}
            </div>

            <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap">
              <button
                onClick={() => editContact(c)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteContact(c.id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}