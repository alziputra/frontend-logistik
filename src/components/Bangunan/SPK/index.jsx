import React from "react";
import { FileText } from "lucide-react";

export default function BangunanSPK({ type = "renovasi", setView = () => {} }) {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-950 p-2.5 rounded-2xl border border-emerald-800/40">
          <FileText className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Surat Perintah Kerja (SPK) - {type.toUpperCase()}</h2>
          <p className="text-xs text-slate-400">Generator & manajemen dokumen SPK logistik.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <p className="text-sm text-slate-300">Form SPK ({type}) siap digunakan untuk pembuatan surat baru.</p>
      </div>
    </div>
  );
}
