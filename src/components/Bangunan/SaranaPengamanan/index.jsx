import React from "react";
import { Shield } from "lucide-react";

export default function BangunanSarana({ facilities = [] }) {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-950 p-2.5 rounded-2xl border border-indigo-800/40">
          <Shield className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Sarana Pengamanan & Korporasi</h2>
          <p className="text-xs text-slate-400">Pemantauan perangkat CCTV dan sistem keamanan fisik.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <p className="text-sm text-slate-300">Total lokasi pemantauan sarana: <strong>{facilities.length}</strong> titik.</p>
      </div>
    </div>
  );
}
