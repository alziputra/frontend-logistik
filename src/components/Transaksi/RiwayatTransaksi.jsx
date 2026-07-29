import React, { useState } from "react";
import { History, Search, FileText, ArrowLeftRight } from "lucide-react";

export default function RiwayatTransaksi({
  transactions = [],
  setTransactions = () => {},
  setFormData = () => {},
  setItems = () => {},
  setActiveTransaction = () => {},
  setView = () => {},
}) {
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.nomorSurat?.toLowerCase().includes(q) ||
      t.penerimaNama?.toLowerCase().includes(q) ||
      t.pengirimNama?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950 p-2.5 rounded-2xl border border-emerald-800/40">
            <History className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Riwayat Transaksi</h2>
            <p className="text-xs text-slate-400">Daftar Berita Acara Serah Terima Barang.</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor / nama..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Nomor Surat</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Jenis Transaksi</th>
                <th className="px-6 py-4">Pengirim ➔ Penerima</th>
                <th className="px-6 py-4 text-center">Jumlah Barang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 italic">
                    Belum ada riwayat transaksi ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((trx, idx) => (
                  <tr key={trx.id || idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-100 font-mono">{trx.nomorSurat}</td>
                    <td className="px-6 py-4 text-slate-300">{trx.tanggal}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${trx.jenisTransaksi === "Barang Masuk" ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/40" : "bg-orange-950/80 text-orange-400 border-orange-800/40"}`}>
                        {trx.jenisTransaksi}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {trx.pengirimNama || "-"} ➔ {trx.penerimaNama || "-"}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-200">
                      {trx.items?.length || 0} Item
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
