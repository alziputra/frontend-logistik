import React from "react";
import { Edit, Trash2, QrCode } from "lucide-react";

export default function KomputerTable({
  isLoading, paginatedData, userRole,
  currentPage, totalPages, startIndex, itemsPerPage,
  setCurrentPage, onEdit, onDelete, onQr,
}) {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse border border-slate-800 min-w-[1000px]">
          <thead>
            <tr className="bg-slate-950 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <th className="p-3 text-center w-12">No</th>
              <th className="p-3">Lokasi / Outlet</th>
              <th className="p-3">Hardware & S/N</th>
              <th className="p-3">IP Address</th>
              <th className="p-3">Spesifikasi</th>
              <th className="p-3 text-center">Status</th>
              {userRole === "admin" && <th className="p-3 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="text-xs text-slate-200 divide-y divide-slate-800">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={userRole === "admin" ? "7" : "6"} className="p-6 text-center text-slate-500">
                  Tidak ada data komputer ditemukan.
                </td>
              </tr>
            ) : (
              paginatedData.map((comp, index) => (
                <tr key={comp.id || index} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 text-center font-mono text-slate-500">{startIndex + index + 1}</td>
                  <td className="p-3 font-semibold text-slate-100">{comp.outlet || "Gudang Pusat"}</td>
                  <td className="p-3 font-medium text-slate-200">{comp.produk || "-"} <br/><span className="text-[10px] text-slate-400 font-mono">{comp.sn || "-"}</span></td>
                  <td className="p-3 font-mono text-emerald-400">{comp.ipAddress || comp.ip_address || "-"}</td>
                  <td className="p-3 text-slate-300">{comp.cpu || "Intel Core i5"} | {comp.ram || "8GB"} | {comp.storage || "512GB SSD"}</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                      {comp.status || "Inventaris"}
                    </span>
                  </td>
                  {userRole === "admin" && (
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => onQr && onQr(comp)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer">
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button onClick={() => onEdit && onEdit(comp)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg cursor-pointer">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete && onDelete(comp.id, comp.produk)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
