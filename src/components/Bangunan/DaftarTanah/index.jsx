import React from "react";
import { Map } from "lucide-react";

export default function BangunanTanah({ lands = [] }) {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-950 p-2.5 rounded-2xl border border-emerald-800/40">
          <Map className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Daftar Tanah & Sertifikat SHGB</h2>
          <p className="text-xs text-slate-400">Manajemen data aset tanah dan legalitas SHGB Pegadaian.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <p className="text-sm text-slate-300">Total data tanah terdaftar: <strong>{lands.length}</strong> unit.</p>
      </div>
    </div>
  );
}
