import React, { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export default function NotificationModal({
  isOpen,
  type = "success", // "success" | "error"
  title = "",
  message = "",
  onClose,
  autoCloseDuration = 3000,
}) {
  useEffect(() => {
    if (isOpen && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDuration, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        {/* Top color bar */}
        <div
          className={`h-1.5 w-full ${
            isSuccess
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-rose-500 to-red-400"
          }`}
        />

        <div className="p-6 text-center">
          <div className="flex justify-end -mt-2 -mr-2 mb-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            ) : (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 animate-pulse">
                <XCircle className="w-10 h-10" />
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-1">
            {title || (isSuccess ? "Berhasil!" : "Gagal!")}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            {message}
          </p>

          <button
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-all shadow-lg cursor-pointer ${
              isSuccess
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20"
                : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/20"
            }`}
          >
            OK, Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
