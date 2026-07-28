import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ToastContainer from "../ui/Toast";
import { GraduationCap } from "lucide-react";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center gap-2 text-sm text-gray-400">
          <GraduationCap size={14} />
          <span>
            &copy; 2026 tugas kuliah dan biaya tracker by firman|Dev👨‍💻
          </span>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
}
