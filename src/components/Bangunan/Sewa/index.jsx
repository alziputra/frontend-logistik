import React from "react";
import { Key } from "lucide-react";

export default function BangunanSewa({ sewas = [] }) {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-teal-950 p-2.5 rounded-2xl border border-teal-800/40">
          <Key className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Sewa Bangunan & Gedung</h2>
          <p className="text-xs text-slate-400">Manajemen kontrak sewa gedung outlet dan instansi.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <p className="text-sm text-slate-300">Total data sewa gedung terdaftar: <strong>{sewas.length}</strong> lokasi.</p>
      </div>
    </div>
  );
}
