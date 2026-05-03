import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import NoPage from "./pages/NoPage";
import Diary from "./pages/Diary";
import ExpenseTracker from "./pages/ExpenseTracker";
import ContactBook from "./pages/ContactBook";
import HabitTracker from "./pages/HabitTracker";
import { toast, Toaster } from "sonner";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Footer from "./components/Footer";
import CacheSystem from "./pages/CacheSystem";
import Attendance from "./pages/Attendance";
import Support from "./pages/Support";
import Supporters from "./pages/Supporters";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar />
          <Toaster position="top-center" richColors theme="light" />

          {/* Main content */}
          <main className="flex-1 text-left">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/diary" element={<Diary />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/expense-tracker" element={<ExpenseTracker />} />
                <Route path="/contact-book" element={<ContactBook />} />
                <Route path="/habit-tracker" element={<HabitTracker />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/support" element={<Support />} />
                <Route path="/supporters" element={<Supporters />} />
              </Route>
              {/* <Route path="/cache" element={<CacheSystem />} /> */}
              <Route path="*" element={<NoPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
