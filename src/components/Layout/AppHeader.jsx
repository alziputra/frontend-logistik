import React from "react";
import UserBadge from "./UserBadge";
import NotificationBell from "./NotificationBell";
import { Sun, Moon, List, Package } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function AppHeader({
  user,
  title,
  printers = [],
  computers = [],
  buildingLands = [],
  buildingSewas = [],
  setView,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="hidden md:flex sticky md:top-0 z-30 h-16 md:h-20 bg-slate-900 border-b border-slate-800 shadow-sm flex items-center justify-between px-4 sm:px-6 print:hidden shrink-0 transition-colors">
      <div className="flex items-center gap-4">
        {!isSidebarOpen ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 text-slate-300 hover:bg-slate-800 rounded-lg transition-all border border-slate-700 cursor-pointer flex items-center justify-center"
              title="Tampilkan Sidebar"
            >
              <List className="w-5 h-5 text-slate-300" />
            </button>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-base text-slate-100 tracking-tight">Logistik Pegadaian</span>
            </div>
          </div>
        ) : (
          <p className="text-sm font-semibold text-slate-300 truncate">
            {title || "Dashboard Logistik"}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Ganti ke Tema Terang (Light Mode)" : "Ganti ke Tema Gelap (Dark Mode)"}
          className={`px-3 py-2 rounded-xl border shadow-sm transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold ${
            theme === "dark"
              ? "bg-slate-800 hover:bg-slate-700/80 text-amber-400 border-slate-700/60"
              : "bg-slate-100 hover:bg-slate-200/80 text-indigo-600 border-slate-300"
          }`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline text-slate-200">Mode Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden lg:inline text-slate-700 font-bold">Mode Gelap</span>
            </>
          )}
        </button>

        <NotificationBell
          printers={printers}
          computers={computers}
          buildingLands={buildingLands}
          buildingSewas={buildingSewas}
          setView={setView}
        />
        <UserBadge user={user} />
      </div>
    </div>
  );
}
