import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../utils/api";
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
  ChevronDown,
  ChevronUp,
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
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-[#111111] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#ff99c8] text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111]">
            <Contact2 className="h-6 w-6 stroke-[2px]" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-widest">
              Axio-Contacts
            </h1>
            <p className="text-[#666666] text-sm font-bold uppercase tracking-widest mt-1">
              Organize your network effortlessly.
            </p>
          </div>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#111111] stroke-[2px]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH CONTACTS..."
            className="w-full border-2 border-[#111111] bg-[#fcf5bf] py-3 pl-11 pr-4 text-sm font-bold uppercase tracking-widest text-[#111111] focus:outline-none shadow-[4px_4px_0px_0px_#111111] placeholder-[#666666]"
          />
        </div>
      </header>

      {/* Form Card */}
      <div className="bg-[#a8defa] border-2 border-[#111111] transition-all overflow-hidden shadow-[6px_6px_0px_0px_#111111]">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full px-6 py-5 flex items-center justify-between hover:bg-white transition-colors border-b-2 border-transparent hover:border-[#111111]"
        >
          <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-[#111111] text-sm">
            {editingId ? (
              <Edit3 className="h-5 w-5 stroke-[2px]" />
            ) : (
              <UserPlus className="h-5 w-5 stroke-[2px]" />
            )}
            {editingId ? "EDIT CONTACT" : "ADD NEW CONTACT"}
          </div>
          {isFormOpen ? (
            <ChevronUp className="w-5 h-5 text-[#111111] stroke-[2px]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#111111] stroke-[2px]" />
          )}
        </button>

        {isFormOpen && (
          <div className="px-6 py-6 border-t-2 border-[#111111] bg-white transition-opacity duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Input
                icon={User}
                label="Full Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="JOHN DOE"
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
                placeholder="JOHN@EMAIL.COM"
              />
              <Input
                icon={FileText}
                label="Notes"
                value={form.notes}
                onChange={(v) => setForm({ ...form, notes: v })}
                placeholder="CLIENT, COLLEAGUE, VENDOR…"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={saveContact}
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-[#111111] bg-[#111111] py-4 font-bold text-white uppercase tracking-widest hover:bg-[#ff99c8] hover:text-[#111111] transition-colors text-sm"
              >
                <Check className="w-4 h-4 stroke-[2px]" />
                {editingId ? "UPDATE CONTACT" : "SAVE CONTACT"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#111111] bg-white px-8 py-4 font-bold text-[#111111] uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors text-sm"
                >
                  <X className="w-4 h-4 stroke-[2px]" />
                  CANCEL
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {loading && (
          <div className="col-span-full py-14 flex justify-center">
             <div className="w-8 h-8 border-[4px] border-[#111111] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && filteredContacts.length === 0 && (
          <div className="col-span-full border-2 border-[#111111] bg-[#e8c0fc] py-20 text-center shadow-[4px_4px_0px_0px_#111111]">
            <p className="text-[#111111] font-bold uppercase tracking-widest text-sm">
              NO CONTACTS FOUND.
            </p>
          </div>
        )}
        {!loading &&
          filteredContacts.map((c) => (
            <article
              key={c._id}
              className="group bg-white p-6 border-2 border-[#111111] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#111111] transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 border-[#111111] bg-[#ff99c8] text-xl font-bold uppercase text-[#111111]">
                  {c.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-[#111111] uppercase tracking-widest text-lg">
                    {c.name}
                  </h3>
                  <div className="mt-2 space-y-2 text-xs font-bold uppercase tracking-widest text-[#666666]">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#111111] stroke-[2px]" />
                      {c.phone}
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="h-4 w-4 text-[#111111] stroke-[2px]" />
                        {c.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t-2 border-[#111111]/10 pt-4">
                <button
                  onClick={() => startEdit(c)}
                  className="p-2 bg-[#fcf5bf] text-[#111111] border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-all"
                >
                  <Edit3 className="h-4 w-4 stroke-[2px]" />
                </button>
                <button
                  onClick={() => deleteContact(c._id)}
                  className="p-2 bg-[#d0f4e0] text-[#111111] border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-all"
                >
                  <Trash2 className="h-4 w-4 stroke-[2px]" />
                </button>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

function Input({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="relative flex items-center border-b-2 border-[#666666]/30 focus-within:border-[#111111] transition-colors">
        <Icon className="absolute left-0 h-4 w-4 text-[#111111] stroke-[2px]" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-2 pl-8 text-[#111111] outline-none font-bold uppercase tracking-widest text-sm placeholder-[#666666]/50"
        />
      </div>
    </div>
  );
}
