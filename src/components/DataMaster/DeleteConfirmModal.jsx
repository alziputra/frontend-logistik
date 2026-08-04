import React from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin menghapus data ini?",
  itemName = "",
  isDeleting = false,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        {/* Header decoration bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">{title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Tindakan ini membutuhkan konfirmasi Anda.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 bg-slate-950/60 border border-slate-800/60 rounded-xl p-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              {message}
            </p>
            {itemName && (
              <div className="mt-2.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-rose-300 truncate">
                "{itemName}"
              </div>
            )}
            <p className="text-[11px] text-rose-400/80 mt-3 font-medium flex items-center gap-1.5">
              <span>⚠️</span> Data yang telah dihapus tidak dapat dikembalikan lagi.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-xl shadow-lg shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Hapus Permanen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
