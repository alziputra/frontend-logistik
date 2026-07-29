import React, { useState } from "react";
import { Printer, Search, Plus } from "lucide-react";

import PrinterTable from "./PrinterTable";
import PrinterModal from "./PrinterModal";
import QrLabelModal from "./QrLabelModal";
import ConfirmDeleteModal from "../../Modal/ConfirmDeleteModal";
import ToastNotif from "../../Modal/ToastNotif";

export default function DataPrinter({ userRole = "admin", printers = [], outlets = [], inventory = [], filterStatus: propFilterStatus = "Semua", setFilterStatus }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatusState, setFilterStatusState] = useState(propFilterStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [qrModalData, setQrModalData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: "" });
  const [notif, setNotif] = useState({ show: false, message: "", type: "success" });

  const filteredData = printers.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.produk?.toLowerCase().includes(q) ||
      item.sn?.toLowerCase().includes(q) ||
      item.outlet?.toLowerCase().includes(q);
    const matchFilter = filterStatusState === "Semua" || item.status === filterStatusState;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-300 relative print:hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <Printer className="w-6 h-6 text-purple-400" /> Manajemen Data Printer
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Kelola spesifikasi hardware, status, dan masa sewa printer outlet.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {userRole === "admin" && (
            <button
              onClick={() => { setEditingId(null); setFormData({}); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition-colors text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Printer
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari model, S/N, atau outlet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-sm text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Total Printer: {filteredData.length}</span>
          </div>
        </div>

        <PrinterTable
          isLoading={false}
          paginatedData={paginatedData}
          filteredData={filteredData}
          userRole={userRole}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          onEdit={(printer) => { setEditingId(printer.id); setFormData(printer); setIsModalOpen(true); }}
          onDelete={(id, nama) => setDeleteConfirm({ show: true, id, name: nama })}
          onQr={setQrModalData}
        />
      </div>

      <PrinterModal
        isOpen={isModalOpen}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsModalOpen(false)}
        onSave={(e) => { e.preventDefault(); setIsModalOpen(false); }}
      />

      <QrLabelModal data={qrModalData} onClose={() => setQrModalData(null)} />

      <ConfirmDeleteModal
        show={deleteConfirm.show}
        name={deleteConfirm.name}
        onConfirm={() => setDeleteConfirm({ show: false, id: null, name: "" })}
        onCancel={() => setDeleteConfirm({ show: false, id: null, name: "" })}
      />

      <ToastNotif notif={notif} onClose={() => setNotif({ show: false, message: "", type: "success" })} />
    </div>
  );
}
