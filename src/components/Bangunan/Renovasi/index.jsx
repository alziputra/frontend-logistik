import React from "react";
import { Hammer } from "lucide-react";

export default function BangunanRenovasi({ renovations = [] }) {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-950 p-2.5 rounded-2xl border border-purple-800/40">
          <Hammer className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Renovasi Gedung & Bangunan</h2>
          <p className="text-xs text-slate-400">Pekerjaan fisik dan renovasi infrastruktur outlet.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <p className="text-sm text-slate-300">Total data pekerjaan renovasi: <strong>{renovations.length}</strong> proyek.</p>
      </div>
    </div>
  );
}
