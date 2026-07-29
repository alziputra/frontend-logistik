import React, { useState, useEffect, useMemo } from "react";
import { X, Edit, Database, Plus, Loader2 } from "lucide-react";

export default function BarangFormModal({
  isOpen,
  editingInv,
  isSaving,
  vendors = [],
  onClose,
  onSubmit,
}) {
  const [tglMulai, setTglMulai] = useState(editingInv?.tanggal_mulai || "");
  const [tglSelesai, setTglSelesai] = useState(editingInv?.tanggal_selesai || "");

  useEffect(() => {
    setTglMulai(editingInv?.tanggal_mulai || "");
    setTglSelesai(editingInv?.tanggal_selesai || "");
  }, [editingInv, isOpen]);

  const { status, masaSewa } = useMemo(() => {
    if (!tglMulai || !tglSelesai) {
      return { status: "Inventaris", masaSewa: 0 };
    }
    const d1 = new Date(tglMulai);
    const d2 = new Date(tglSelesai);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return { status: "Inventaris", masaSewa: 0 };
    }
    let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    if (months < 0) months = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const st = d2 >= today ? "Sewa Berjalan" : "Sewa Habis";
    return { status: st, masaSewa: months };
  }, [tglMulai, tglSelesai]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-950 p-2 rounded-xl border border-emerald-800/40">
              {editingInv
                ? <Edit className="w-5 h-5 text-emerald-400" />
                : <Database className="w-5 h-5 text-emerald-400" />}
            </div>
            <h3 className="font-bold text-lg text-slate-100">
              {editingInv ? "Edit Data Barang" : "Tambah Master Barang"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="formBarang" onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Barang *</label>
                <input
                  name="nama"
                  defaultValue={editingInv?.nama || ""}
                  required
                  placeholder="Ketik nama barang / asset..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Stok *</label>
                <input
                  name="kuantitas"
                  type="number"
                  defaultValue={editingInv?.kuantitas !== undefined ? editingInv.kuantitas : (editingInv?.stok || 0)}
                  min="0"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Satuan *</label>
                <select
                  name="satuan"
                  defaultValue={editingInv?.satuan || "Pcs"}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option>Pcs</option>
                  <option>Unit</option>
                  <option>Box</option>
                  <option>Set</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Vendor (dari Database)</label>
                <input
                  name="vendor_nama"
                  list="vendor-options-list"
                  defaultValue={editingInv?.vendor_nama || editingInv?.vendor?.nama || ""}
                  placeholder="Pilih atau ketik nama vendor..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
                <datalist id="vendor-options-list">
                  {vendors.map((v) => (
                    <option key={v.id} value={v.nama} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">No. SPK</label>
                <input
                  name="no_spk"
                  defaultValue={editingInv?.no_spk || ""}
                  placeholder="No. SPK..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">No. PKS</label>
                <input
                  name="no_pks"
                  defaultValue={editingInv?.no_pks || ""}
                  placeholder="No. PKS..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tgl Mulai</label>
                <input
                  name="tanggal_mulai"
                  type="date"
                  value={tglMulai}
                  onChange={(e) => setTglMulai(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tgl Selesai</label>
                <input
                  name="tanggal_selesai"
                  type="date"
                  value={tglSelesai}
                  onChange={(e) => setTglSelesai(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status (Otomatis)</label>
                <input type="hidden" name="status" value={status} />
                <input
                  type="text"
                  readOnly
                  value={status}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Masa Sewa (Bln)</label>
                <input
                  name="masa_sewa_bulan"
                  type="number"
                  readOnly
                  value={masaSewa}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-semibold cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-4 flex justify-end gap-3 mt-4 border-t border-slate-800 pt-4 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingInv ? "Simpan Perubahan" : "Simpan Barang"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
