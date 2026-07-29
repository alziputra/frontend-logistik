import React from "react";
import UserBadge from "./UserBadge";
import NotificationBell from "./NotificationBell";
import { Sun, Moon, List, Package } from "lucide-react";

export default function AppHeader({
  user,
  title,
  printers = [],
  computers = [],
  buildingLands = [],
  buildingSewas = [],
  setView,
  theme,
  setTheme,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
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
      <div className="flex items-center gap-4">
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
