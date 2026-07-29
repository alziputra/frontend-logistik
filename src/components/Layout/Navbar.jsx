import React, { useState } from "react";
import {
  Package, LayoutDashboard, LogOut, ChevronDown, FileText, Monitor, Printer, Shield,
  Users, List, Cpu, Box, Building2, Database, ArrowRightLeft, History
} from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({
  view,
  setView,
  startNewDocument,
  printers = [],
  computers = [],
  buildingLands = [],
  buildingSewas = [],
  isSidebarOpen,
  setIsSidebarOpen,
  setLandFilter,
  setSewaFilter,
  setComputerFilter,
  setPrinterFilter,
}) {
  const { user, logout } = useAuth();
  const [isMasterOpen, setIsMasterOpen] = useState(view.startsWith("master_"));
  const [isPerangkatOpen, setIsPerangkatOpen] = useState(view.startsWith("perangkat_"));
  const [isBuatSuratOpen, setIsBuatSuratOpen] = useState(view.startsWith("spk_") || view.startsWith("sopp_") || view === "form");

  const closeMenu = () => setIsSidebarOpen(false);

  const handleNavClick = (targetView) => {
    if (setLandFilter) setLandFilter("");
    if (setSewaFilter) setSewaFilter("");
    if (setComputerFilter) setComputerFilter("Semua");
    if (setPrinterFilter) setPrinterFilter("Semua");

    setView(targetView);
  };

  const handleStartNew = () => {
    if (setLandFilter) setLandFilter("");
    if (setSewaFilter) setSewaFilter("");
    if (setComputerFilter) setComputerFilter("Semua");
    if (setPrinterFilter) setPrinterFilter("Semua");

    if (startNewDocument) startNewDocument();
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-30 print:hidden shadow-sm transition-colors">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center">
            <List className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg text-slate-100 tracking-tight">Logistik Pegadaian</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell
            printers={printers}
            computers={computers}
            buildingLands={buildingLands}
            buildingSewas={buildingSewas}
            setView={setView}
            isMobile={true}
          />
        </div>
      </div>

      {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-black/60 z-40 print:hidden transition-opacity" onClick={closeMenu} />}

      <aside className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 print:hidden flex flex-col z-50 shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-4 h-16 md:h-20 border-b border-slate-800 shrink-0">
          <button onClick={closeMenu} className="p-1.5 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0">
            <List className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-emerald-950/80 border border-emerald-800/40 p-1.5 rounded-lg">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 shrink-0" />
            </div>
            <span className="font-bold text-base md:text-lg text-slate-100 tracking-tight">Logistik Pegadaian</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-6 custom-scrollbar pb-6">
          {/* MENU DASHBOARD */}
          <button onClick={() => handleNavClick("dashboard")} className={`w-full px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 text-left transition-colors ${view === "dashboard" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50" : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400"}`}>
            <LayoutDashboard className="w-5 h-5 shrink-0" /> Dashboard Informasi
          </button>

          {/* KATEGORI: SURAT & DOKUMEN */}
          <div className="pt-3 pb-1 border-t border-slate-800 mt-2">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider px-4">Surat & Dokumen</span>
          </div>

          <div className="space-y-1">
            <button onClick={() => setIsBuatSuratOpen(!isBuatSuratOpen)} className={`w-full px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between text-left transition-colors ${view === "form" ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400"}`}>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 shrink-0" /> Surat Serah Terima
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${isBuatSuratOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isBuatSuratOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-slate-800 ml-6 mt-1">
                <button onClick={handleStartNew} className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-left transition-colors ${view === "form" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40" : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60"}`}>
                  <FileText className="w-4 h-4 shrink-0" /> Buat Surat Baru
                </button>
                <button onClick={() => handleNavClick("riwayat")} className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-left transition-colors ${view === "riwayat" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40" : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60"}`}>
                  <History className="w-4 h-4 shrink-0" /> Riwayat Transaksi
                </button>
              </div>
            </div>
          </div>

          {/* KATEGORI: PERANGKAT IT */}
          <div className="pt-3 pb-1 border-t border-slate-800 mt-2">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider px-4">Perangkat IT</span>
          </div>

          <div className="space-y-1">
            <button onClick={() => setIsPerangkatOpen(!isPerangkatOpen)} className={`w-full px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between text-left transition-colors ${view.startsWith("perangkat_") ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400"}`}>
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 shrink-0" /> Data Perangkat
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${isPerangkatOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPerangkatOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-slate-800 ml-6 mt-1">
                <button onClick={() => handleNavClick("perangkat_komputer")} className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-left transition-colors ${view === "perangkat_komputer" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40" : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60"}`}>
                  <Cpu className="w-4 h-4 shrink-0" /> Data Komputer/PC
                </button>
                <button onClick={() => handleNavClick("perangkat_printer")} className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-left transition-colors ${view === "perangkat_printer" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40" : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60"}`}>
                  <Printer className="w-4 h-4 shrink-0" /> Data Printer
                </button>
              </div>
            </div>
          </div>

          {/* KATEGORI: DATA MASTER */}
          <div className="pt-3 pb-1 border-t border-slate-800 mt-2">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider px-4">Master Data</span>
          </div>

          <div className="space-y-1">
            <button onClick={() => setIsMasterOpen(!isMasterOpen)} className={`w-full px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between text-left transition-colors ${view.startsWith("master_") ? "bg-slate-800 text-emerald-400" : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400"}`}>
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 shrink-0" /> Master Data
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${isMasterOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMasterOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-slate-800 ml-6 mt-1">
                <button onClick={() => handleNavClick("master_barang")} className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-left transition-colors ${view === "master_barang" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40" : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60"}`}>
                  <Box className="w-4 h-4 shrink-0" /> Master Barang/Asset
                </button>
                <button onClick={() => handleNavClick("master_outlet")} className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-left transition-colors ${view === "master_outlet" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40" : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60"}`}>
                  <Building2 className="w-4 h-4 shrink-0" /> Master Instansi/Outlet
                </button>
                <button onClick={() => handleNavClick("master_vendor")} className={`w-full px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-left transition-colors ${view === "master_vendor" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40" : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60"}`}>
                  <Users className="w-4 h-4 shrink-0" /> Master Vendor/Penyedia
                </button>
              </div>
            </div>
          </div>

          {/* KELOLA USER (ADMIN ONLY) */}
          {user?.role === "admin" && (
            <>
              <div className="pt-3 pb-1 border-t border-slate-800 mt-2">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider px-4">Pengaturan System</span>
              </div>
              <button onClick={() => handleNavClick("kelola_user")} className={`w-full px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 text-left transition-colors ${view === "kelola_user" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50" : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400"}`}>
                <Users className="w-5 h-5 shrink-0" /> Kelola User & Akses
              </button>
            </>
          )}
        </nav>

        {/* FOOTER USER / LOGOUT */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 text-sm font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Keluar (Logout)
          </button>
        </div>
      </aside>
    </>
  );
}
