import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";

import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import NoPage from "./pages/NoPage";
import Diary from "./pages/Diary";
import ExpenseTracker from "./pages/ExpenseTracker";
import ContactBook from "./pages/ContactBook";
import HabitTracker from "./pages/HabitTracker";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Sidebar />
      <Toaster position="top-center" />

      {/* Main content */}
      <main className="pt-14 md:pt-0 md:ml-64 text-left bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/contact-book" element={<ContactBook />} />
          <Route path="/habit-tracker" element={<HabitTracker />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
