import React, { useState } from "react";
import {
  Database, Plus, Search, Edit, Trash2, Box
} from "lucide-react";
import { addInventory, updateInventory, deleteInventory } from "../../services/inventoryService";
import BarangFormModal from "./BarangFormModal";

export default function MasterBarang({ inventory = [], vendors = [], userRole = "admin", loadAllData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInv, setEditingInv] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredInventory = inventory.filter((item) => {
    const q = searchQuery.toLowerCase();
    const vendorName = item.vendor_nama || item.vendor?.nama || "-";
    return (
      item.nama?.toLowerCase().includes(q) ||
      vendorName.toLowerCase().includes(q) ||
      item.no_spk?.toLowerCase().includes(q) ||
      item.no_pks?.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingInv(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingInv(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const form = new FormData(e.target);
    const rawVendorNama = (form.get("vendor_nama") || "").trim();
    const vendorNamaVal = rawVendorNama === "" ? "-" : rawVendorNama;
    const matchingVendor = vendors.find(v => v.nama?.toLowerCase() === vendorNamaVal.toLowerCase());

    const payload = {
      nama: form.get("nama"),
      kuantitas: Number(form.get("kuantitas")),
      stok: Number(form.get("kuantitas")),
      satuan: form.get("satuan"),
      vendorId: matchingVendor ? matchingVendor.id : null,
      vendor_nama: vendorNamaVal,
      no_spk: form.get("no_spk") || null,
      no_pks: form.get("no_pks") || null,
      tanggal_mulai: form.get("tanggal_mulai") || null,
      tanggal_selesai: form.get("tanggal_selesai") || null,
      status: form.get("status") || "Inventaris",
      masa_sewa_bulan: Number(form.get("masa_sewa_bulan") || 0),
    };

    try {
      if (editingInv) {
        await updateInventory(editingInv.id, payload);
      } else {
        await addInventory(payload);
      }
      setIsModalOpen(false);
      if (loadAllData) loadAllData();
    } catch (err) {
      console.error("Gagal menyimpan data barang:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus barang ini dari master data?")) return;
    try {
      await deleteInventory(id);
      if (loadAllData) loadAllData();
    } catch (err) {
      console.error("Gagal menghapus data barang:", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950 p-2.5 rounded-2xl border border-emerald-800/40">
            <Box className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Master Data Barang / Asset</h2>
            <p className="text-xs text-slate-400">Manajemen katalog barang logistik dan stok gudang.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari barang / SPK / vendor..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
            />
          </div>
          {userRole === "admin" && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Tambah Barang
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12 text-center">No</th>
                <th className="px-6 py-4">Nama Barang</th>
                <th className="px-6 py-4 text-center">Stok</th>
                <th className="px-6 py-4">Satuan</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">No. SPK / PKS</th>
                <th className="px-6 py-4 text-center">Status</th>
                {userRole === "admin" && <th className="px-6 py-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={userRole === "admin" ? "8" : "7"} className="px-6 py-8 text-center text-slate-500 italic">
                    Belum ada barang di katalog master data.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-center text-slate-500 font-mono">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-100">{item.nama || "-"}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-400 font-mono">
                      {item.kuantitas !== undefined ? item.kuantitas : (item.stok || 0)}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{item.satuan || "Pcs"}</td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{item.vendor_nama || item.vendor?.nama || "-"}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                      {item.no_spk || item.no_pks || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.status || "Inventaris"}
                      </span>
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenEdit(item)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg cursor-pointer">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg cursor-pointer">
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

      <BarangFormModal
        isOpen={isModalOpen}
        editingInv={editingInv}
        isSaving={isSaving}
        vendors={vendors}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
