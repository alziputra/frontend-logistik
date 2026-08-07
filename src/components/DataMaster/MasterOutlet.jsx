import React, { useState } from "react";
import { Building2, Search, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { addInstansi, updateInstansi, deleteInstansi } from "../../services/instansiService";
import OutletFormModal from "./OutletFormModal";
import ExcelActionButtons from "../Common/ExcelActionButtons";

export default function MasterOutlet({ outlets = [], userRole = "admin", loadAllData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredOutlets = outlets.filter((out) => {
    const q = searchQuery.toLowerCase();
    return (
      out.nama?.toLowerCase().includes(q) ||
      out.code?.toLowerCase().includes(q) ||
      out.kode?.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingOutlet(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (out) => {
    setEditingOutlet(out);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const form = new FormData(e.target);
    const payload = {
      code: form.get("kode"),
      nama: form.get("nama"),
    };

    try {
      if (editingOutlet) {
        await updateInstansi(editingOutlet.id, payload);
      } else {
        await addInstansi(payload);
      }
      setIsModalOpen(false);
      if (loadAllData) loadAllData();
    } catch (err) {
      console.error("Gagal menyimpan data instansi:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus instansi ini?")) return;
    try {
      await deleteInstansi(id);
      if (loadAllData) loadAllData();
    } catch (err) {
      console.error("Gagal menghapus data instansi:", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950 p-2.5 rounded-2xl border border-emerald-800/40">
            <Building2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Master Data Instansi / Outlet</h2>
            <p className="text-xs text-slate-400">Manajemen lokasi unit kerja & kantor cabang Pegadaian.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode / nama instansi..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500"
            />
          </div>
          <ExcelActionButtons
            data={filteredOutlets}
            fileName="Master_Instansi_Outlet_Pegadaian"
            headersMap={{
              code: "Kode Instansi",
              nama: "Nama Outlet / Instansi",
            }}
            onImport={async (parsedRows) => {
              if (!parsedRows || parsedRows.length === 0) return;
              let successCount = 0;
              for (const row of parsedRows) {
                const nama = row.nama || row["Nama Outlet / Instansi"] || row["nama"];
                const code = row.code || row.kode || row["Kode Instansi"] || row["kode"];
                if (!nama) continue;
                try {
                  await addInstansi({ code: code || "INST", nama });
                  successCount++;
                } catch (err) {
                  console.error("Error import outlet row:", err);
                }
              }
              alert(`${successCount} data instansi/outlet berhasil diimpor.`);
              if (loadAllData) loadAllData();
            }}
          />
          {userRole === "admin" && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Tambah Instansi
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
                <th className="px-6 py-4">Kode Instansi</th>
                <th className="px-6 py-4">Nama Outlet / Instansi</th>
                {userRole === "admin" && <th className="px-6 py-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOutlets.length === 0 ? (
                <tr>
                  <td colSpan={userRole === "admin" ? "4" : "3"} className="px-6 py-8 text-center text-slate-500 italic">
                    Belum ada data instansi terdaftar.
                  </td>
                </tr>
              ) : (
                filteredOutlets.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-center text-slate-500 font-mono">{idx + 1}</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">{item.code || item.kode || "-"}</td>
                    <td className="px-6 py-4 font-bold text-slate-100 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {item.nama || "-"}
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

      <OutletFormModal
        isOpen={isModalOpen}
        editingOutlet={editingOutlet}
        isSaving={isSaving}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
