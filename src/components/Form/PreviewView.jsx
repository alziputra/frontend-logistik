import React, { useState } from "react";
import { Printer, CheckCircle2, Maximize2, Minimize2, ArrowLeft, AlertCircle, X } from "lucide-react";

const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return "4 Agustus 2026";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const NOMOR_PATTERN = /^\d{3}\/\d{5}\.\d{2}\/\d{2}\/\d{4}$/;

const checkNomorValid = (nomor) => {
  if (!nomor || typeof nomor !== "string") return false;
  if (nomor.startsWith("000/")) return false;
  return NOMOR_PATTERN.test(nomor);
};

const PreviewView = ({
  formData = {},
  items = [],
  activeTransaction = null,
  setView = () => {},
  handleSaveTransaction = () => {},
  isSaving = false,
  isViewOnly = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nomorIsValid = checkNomorValid(formData.nomorSurat);

  const handlePrint = () => {
    if (!nomorIsValid) {
      alert("⚠️ Harap masukkan nomor surat terlebih dahulu sebelum mencetak dokumen!");
      return;
    }
    window.print();
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!nomorIsValid) {
      alert("⚠️ Harap masukkan nomor surat terlebih dahulu sebelum menyimpan transaksi!");
      return;
    }
    if (handleSaveTransaction) {
      await handleSaveTransaction();
    }
  };

  // Kalo data tujuan kosong (surat baru), tampilkan titik-titik (bukan hardcoded CPS METRO)
  const tujuanStr =
    formData.tujuan ||
    formData.outletTujuan ||
    formData.pihak2Instansi ||
    formData.penerimaInstansi ||
    "........................";

  const renderDocumentContent = (isModal = false) => (
    <div
      className={`p-5 sm:p-10 bg-white text-black flex flex-col justify-between ${
        isModal ? "min-h-[1050px] w-full max-w-4xl mx-auto shadow-2xl rounded-2xl" : "min-h-[920px] sm:min-h-[980px] print:min-h-[279mm] print:max-h-[279mm] w-full min-w-[600px] sm:min-w-0"
      }`}
      id={isModal ? "printable-area-modal" : "printable-area"}
    >
      <div>
        {/* Kop Surat Header */}
        <div className="flex items-center justify-between pb-2.5">
          {/* Pegadaian Official Logo */}
          <div className="flex items-center">
            <img
              src="/logo-pegadaian.png"
              alt="Logo Pegadaian"
              className="h-10 sm:h-12 w-auto object-contain"
              onError={(e) => {
                e.target.src = "/logo-pegadaian.svg";
              }}
            />
          </div>

          {/* Department Title */}
          <div className="text-right">
            <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-black leading-tight font-sans">
              DEPARTEMEN LOGISTIK
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">Sistem Informasi Manajemen Barang</p>
          </div>
        </div>

        <div className="border-b-[3px] border-black mb-3 sm:mb-4"></div>

        {/* Document Title */}
        <div className="text-center mb-3 sm:mb-4">
          <h2 className="text-xs sm:text-sm font-extrabold underline uppercase text-black leading-tight tracking-wide">
            BERITA ACARA SERAH TERIMA {formData.jenisTransaksi ? formData.jenisTransaksi.toUpperCase() : "BARANG KELUAR"}
          </h2>
          <p className="text-[11px] sm:text-xs text-black mt-0.5 font-medium">
            Nomor: {formData.nomorSurat || "...../00108.00/04/2026"}
          </p>
        </div>

        {/* Yellow Banner 1: Penerima Barang */}
        <div className="bg-[#FFE600] px-3 py-1.5 mb-3 text-[11px] sm:text-xs font-bold text-black border border-black flex items-center gap-2">
          <span>Penerima Barang:</span>
          <span className="font-extrabold uppercase">{tujuanStr}</span>
        </div>

        {/* Opening Paragraph */}
        <p className="text-[11px] sm:text-xs text-black leading-relaxed mb-3">
          Pada hari ini, tanggal <strong className="font-bold">{formatIndonesianDate(formData.tanggal)}</strong> bertempat di <strong className="font-bold">{formData.lokasi || "Jakarta"}</strong>, telah dilakukan serah terima barang dengan rincian sebagai berikut:
        </p>

        {/* Items Table */}
        <table className="w-full border-collapse mb-3 text-[11px] sm:text-xs border border-black">
          <thead>
            <tr className="bg-gray-100 font-bold text-black border-b border-black">
              <th className="border border-black py-1.5 px-1.5 sm:px-2 text-center w-[6%] font-bold">No</th>
              <th className="border border-black py-1.5 px-1.5 sm:px-2 text-left w-[25%] font-bold">Nama Barang</th>
              <th className="border border-black py-1.5 px-1.5 sm:px-2 text-left w-[15%] font-bold">S/N</th>
              <th className="border border-black py-1.5 px-1.5 sm:px-2 text-center w-[8%] font-bold">Qty</th>
              <th className="border border-black py-1.5 px-1.5 sm:px-2 text-center w-[10%] font-bold">Satuan</th>
              <th className="border border-black py-1.5 px-1.5 sm:px-2 text-left w-[18%] font-bold">Outlet Tujuan</th>
              <th className="border border-black py-1.5 px-1.5 sm:px-2 text-left w-[18%] font-bold">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index} className="text-black">
                <td className="border border-black py-1.5 px-1.5 sm:px-2 text-center">{index + 1}</td>
                <td className="border border-black py-1.5 px-1.5 sm:px-2 font-medium">{item.namaBarang || item.nama}</td>
                <td className="border border-black py-1.5 px-1.5 sm:px-2 font-mono text-[10px] sm:text-[11px]">{item.sn || "-"}</td>
                <td className="border border-black py-1.5 px-1.5 sm:px-2 text-center font-bold">{item.jumlah || item.kuantitas}</td>
                <td className="border border-black py-1.5 px-1.5 sm:px-2 text-center">{item.satuan || "Unit"}</td>
                <td className="border border-black py-1.5 px-1.5 sm:px-2 uppercase">{item.outlet || (tujuanStr !== "........................" ? tujuanStr : "-")}</td>
                <td className="border border-black py-1.5 px-1.5 sm:px-2">{item.keterangan || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Closing Paragraph */}
        <p className="text-[11px] sm:text-xs text-black leading-relaxed mb-3">
          Demikian Berita Acara Serah Terima Barang ini dibuat dengan sebenarnya dalam keadaan sadar dan tanpa paksaan dari pihak manapun, untuk dapat dipergunakan sebagaimana mestinya.
        </p>

        {/* Yellow Banner 2: NOTE */}
        <div className="bg-[#FFE600] px-3 py-1.5 mb-4 sm:mb-5 text-[11px] sm:text-xs font-bold text-black border border-black">
          NOTE : MOHON UNTUK DISIMPAN SEBAGAI BUKTI SAH SERAH TERIMA BARANG
        </div>

        {/* Signature Section (Yang Menerima | Yang Menyerahkan | Mengetahui) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-[10px] sm:text-xs text-black mb-6 sm:mb-8">
          <div>
            <p className="font-semibold mb-8 sm:mb-12">Yang Menerima,</p>
            <p className="font-bold underline uppercase text-black break-words">
              {formData.pihak2Nama || formData.penerimaNama || "........................"}
            </p>
            <p className="text-[9px] sm:text-[11px] text-gray-700 leading-tight">
              {formData.pihak2Jabatan || formData.penerimaJabatan || ""}
            </p>
          </div>

          <div>
            <p className="font-semibold mb-8 sm:mb-12">Yang Menyerahkan,</p>
            <p className="font-bold underline uppercase text-black break-words">
              {formData.pihak1Nama || formData.pengirimNama || "AHMAD DENDY SYAPUTRA"}
            </p>
            <p className="text-[9px] sm:text-[11px] text-gray-700 leading-tight">
              {formData.pihak1Jabatan || formData.pengirimJabatan || "Staff Pengadaan dan Logistik"}
            </p>
          </div>

          <div>
            <p className="font-semibold mb-8 sm:mb-12">Mengetahui,</p>
            <p className="font-bold underline uppercase text-black break-words">
              {formData.pihakMengetahuiNama || formData.mengetahuiNama || "ZONI RAHMAWAN PUTRA"}
            </p>
            <p className="text-[9px] sm:text-[11px] text-gray-600 leading-tight">
              {formData.pihakMengetahuiJabatan || formData.mengetahuiJabatan || "Kabag Pengadaan dan Logistik"}
            </p>
          </div>
        </div>
      </div>

      {/* Official Footer PT PEGADAIAN - Pinned to bottom of A4 paper */}
      <div className="official-footer pt-2.5 border-t-2 border-black text-black mt-auto">
        <p className="font-bold text-xs uppercase mb-0.5">PT. PEGADAIAN</p>
        <p className="text-[10px] sm:text-[11px] text-gray-700 leading-tight">Kantor Wilayah VIII Jakarta 1</p>
        <p className="text-[10px] sm:text-[11px] text-gray-700 leading-tight">Jl. Senen Raya No. 36 Jakarta Pusat 10410</p>
        <p className="text-[10px] sm:text-[11px] text-gray-700 leading-tight">Telp : (021) 3840229 &nbsp;&nbsp;&nbsp;&nbsp; Fax : (021) 3454116</p>
      </div>
    </div>
  );

  return (
    <div className="w-full pt-5 sm:pt-2 pb-6 print:p-0">
      
      {/* Print Specific CSS Overrides */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm 8mm 10mm;
          }
          html, body, #root, main, section, article {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          #printable-area, #printable-area-modal {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            min-height: calc(297mm - 16mm) !important;
            max-height: calc(297mm - 16mm) !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .official-footer {
            margin-top: auto !important;
            padding-top: 6px !important;
            border-top: 2px solid #000000 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>

      {/* Warning Banner if Nomor Surat is missing or invalid */}
      {!nomorIsValid && !isViewOnly && (
        <div className="print:hidden mb-2.5 px-3.5 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-2 text-amber-500 dark:text-amber-400 text-xs font-semibold shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" />
          <span>Nomor surat belum diisi! Harap masukkan nomor surat terlebih dahulu untuk mencetak atau menyimpan transaksi.</span>
        </div>
      )}

      {/* Top Action Bar (Dedicated Toolbar Card - Clean Light & Dark Mode Styling) */}
      <div className="print:hidden mb-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-md flex flex-wrap items-center justify-between gap-2.5 transition-colors">
        <div className="flex items-center gap-2">
          {/* Tombol Kembali ke Riwayat (jika Mode Lihat Surat) atau Edit Kembali (jika di Mobile) */}
          {isViewOnly ? (
            <button
              type="button"
              onClick={() => setView("riwayat")}
              className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs transition-colors cursor-pointer shrink-0 active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Kembali ke Riwayat</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setView("form")}
              className="lg:hidden flex items-center gap-1.5 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Edit Kembali</span>
            </button>
          )}

          {/* Tombol Perbesar Tampilan */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            title="Perbesar Tampilan Surat (Fullscreen)"
          >
            <Maximize2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Perbesar</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol Cetak Surat */}
          <button
            type="button"
            onClick={handlePrint}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer shrink-0 shadow-sm active:scale-95 ${
              nomorIsValid
                ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-600 shadow-blue-600/20"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-75"
            }`}
            title="Cetak Surat (A4)"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak</span>
          </button>

          {!isViewOnly && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-70 active:scale-95 shrink-0 ${
                nomorIsValid
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-75"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Transaksi"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Area Container Card */}
      <div className="print-wrapper w-full bg-white shadow-xl print:shadow-none relative text-slate-900 rounded-2xl print:rounded-none overflow-hidden print:overflow-visible border border-slate-200 print:border-none">
        <div className="overflow-x-auto bg-white">
          {renderDocumentContent(false)}
        </div>
      </div>

      {/* Fullscreen Document Zoom Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto flex flex-col items-center print:p-0 print:bg-white print:static animate-in fade-in duration-200">
          
          {/* Sticky Top Header Control Bar */}
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-4 flex items-center justify-between sticky top-0 z-50 shadow-2xl print:hidden">
            {/* Left Side: Tombol Kembali & Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="Kembali ke tampilan normal"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
                <span>Kembali</span>
              </button>
              
              <div className="hidden sm:flex items-center gap-2 text-slate-200 font-bold text-xs sm:text-sm border-l border-slate-700 pl-3">
                <Maximize2 className="w-4 h-4 text-purple-400" />
                <span>Pratinjau Surat Ukuran Penuh (A4)</span>
              </div>
            </div>

            {/* Right Side: Tombol Cetak & Tutup */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Surat</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Tutup Perbesar"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Tutup</span>
              </button>
            </div>
          </div>

          {/* Center A4 Document Container */}
          <div className="w-full max-w-4xl my-auto overflow-x-auto flex justify-center pb-8">
            {renderDocumentContent(true)}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewView;
