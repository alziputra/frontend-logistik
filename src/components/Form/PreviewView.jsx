import React from "react";
import { ArrowLeft, Printer, CheckCircle2 } from "lucide-react";

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

const PreviewView = ({
  formData = {},
  items = [],
  activeTransaction = null,
  setView = () => {},
  handleSaveTransaction = () => {},
  isSaving = false,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const tujuanStr =
    formData.tujuan ||
    formData.outletTujuan ||
    formData.pihak2Instansi ||
    formData.penerimaInstansi ||
    "CPS METRO BOULEVARD CIKARANG";

  return (
    <div className="print-wrapper w-full max-w-4xl mx-auto bg-white my-6 print:my-0 shadow-xl print:shadow-none relative text-slate-900 rounded-2xl print:rounded-none overflow-hidden print:overflow-visible border border-slate-200 print:border-none">
      
      {/* Print Specific CSS Overrides */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 12mm 15mm;
          }
          html, body, #root, main, section, article {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
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
          #printable-area {
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
            min-height: calc(297mm - 24mm) !important;
            box-sizing: border-box !important;
          }
          .bg-\\[\\#FFE600\\] {
            background-color: #FFE600 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .bg-gray-100 {
            background-color: #F3F4F6 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          table, tr, td, th, .grid {
            page-break-inside: avoid !important;
          }
          .official-footer {
            margin-top: auto !important;
            padding-top: 12px !important;
            border-top: 2px solid #000000 !important;
            page-break-after: avoid !important;
          }
        }
      `}</style>

      {/* Top Action Bar (Hidden when printing) */}
      <div className="print:hidden p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
        <button
          onClick={() => setView("form")}
          className="flex items-center gap-2 text-slate-200 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700 font-semibold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Edit Kembali
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-slate-200 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Surat
          </button>

          <button
            onClick={handleSaveTransaction}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-70"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSaving ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </div>
      </div>

      {/* Printable Area - Official Pegadaian Template */}
      <div className="p-8 sm:p-14 print:p-0 bg-white text-black min-h-[1050px] print:min-h-[273mm] flex flex-col justify-between" id="printable-area">
        <div>
          {/* Kop Surat Header */}
          <div className="flex items-center justify-between pb-3">
            {/* Pegadaian Official Logo */}
            <div className="flex items-center">
              <img
                src="/logo-pegadaian.png"
                alt="Logo Pegadaian"
                className="h-14 w-auto object-contain"
                onError={(e) => {
                  e.target.src = "/logo-pegadaian.svg";
                }}
              />
            </div>

            {/* Department Title */}
            <div className="text-right">
              <h1 className="text-lg font-extrabold uppercase tracking-wider text-black leading-tight font-sans">
                DEPARTEMEN LOGISTIK
              </h1>
              <p className="text-xs text-gray-600 font-medium">Sistem Informasi Manajemen Barang</p>
            </div>
          </div>

          <div className="border-b-[3px] border-black mb-5"></div>

          {/* Document Title */}
          <div className="text-center mb-5">
            <h2 className="text-base font-extrabold underline uppercase text-black leading-tight tracking-wide">
              BERITA ACARA SERAH TERIMA {formData.jenisTransaksi ? formData.jenisTransaksi.toUpperCase() : "BARANG KELUAR"}
            </h2>
            <p className="text-xs text-black mt-1 font-medium">
              Nomor: {formData.nomorSurat || "530/00108.00/04/2026"}
            </p>
          </div>

          {/* Yellow Banner 1: Penerima Barang */}
          <div className="bg-[#FFE600] px-3 py-1.5 mb-4 text-xs font-bold text-black border border-black flex items-center gap-2">
            <span>Penerima Barang:</span>
            <span className="font-extrabold uppercase">{tujuanStr}</span>
          </div>

          {/* Opening Paragraph */}
          <p className="text-xs text-black leading-relaxed mb-4">
            Pada hari ini, tanggal <strong className="font-bold">{formatIndonesianDate(formData.tanggal)}</strong> bertempat di <strong className="font-bold">{formData.lokasi || "Jakarta"}</strong>, telah dilakukan serah terima barang dengan rincian sebagai berikut:
          </p>

          {/* Items Table */}
          <table className="w-full border-collapse mb-4 text-xs border border-black">
            <thead>
              <tr className="bg-gray-100 font-bold text-black border-b border-black">
                <th className="border border-black py-2 px-2 text-center w-[6%] font-bold">No</th>
                <th className="border border-black py-2 px-2 text-left w-[25%] font-bold">Nama Barang</th>
                <th className="border border-black py-2 px-2 text-left w-[15%] font-bold">S/N</th>
                <th className="border border-black py-2 px-2 text-center w-[8%] font-bold">Qty</th>
                <th className="border border-black py-2 px-2 text-center w-[10%] font-bold">Satuan</th>
                <th className="border border-black py-2 px-2 text-left w-[18%] font-bold">Outlet Tujuan</th>
                <th className="border border-black py-2 px-2 text-left w-[18%] font-bold">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index} className="text-black">
                  <td className="border border-black py-2 px-2 text-center">{index + 1}</td>
                  <td className="border border-black py-2 px-2 font-medium">{item.namaBarang || item.nama}</td>
                  <td className="border border-black py-2 px-2 font-mono text-[11px]">{item.sn || "-"}</td>
                  <td className="border border-black py-2 px-2 text-center font-bold">{item.jumlah || item.kuantitas}</td>
                  <td className="border border-black py-2 px-2 text-center">{item.satuan || "Unit"}</td>
                  <td className="border border-black py-2 px-2 uppercase">{item.outlet || tujuanStr}</td>
                  <td className="border border-black py-2 px-2">{item.keterangan || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Closing Paragraph */}
          <p className="text-xs text-black leading-relaxed mb-4">
            Demikian Berita Acara Serah Terima Barang ini dibuat dengan sebenarnya dalam keadaan sadar dan tanpa paksaan dari pihak manapun, untuk dapat dipergunakan sebagaimana mestinya.
          </p>

          {/* Yellow Banner 2: NOTE */}
          <div className="bg-[#FFE600] px-3 py-1.5 mb-6 text-xs font-bold text-black border border-black">
            NOTE : MOHON UNTUK DISIMPAN SEBAGAI BUKTI SAH SERAH TERIMA BARANG
          </div>

          {/* Signature Section (Yang Menerima | Yang Menyerahkan | Mengetahui) */}
          <div className="grid grid-cols-3 gap-4 text-xs text-black mb-10">
            <div>
              <p className="font-semibold mb-14">Yang Menerima,</p>
              <p className="font-bold underline uppercase text-black">
                {formData.pihak2Nama || formData.penerimaNama || "........................"}
              </p>
              <p className="text-[11px] text-gray-700">
                {formData.pihak2Jabatan || formData.penerimaJabatan || ""}
              </p>
            </div>

            <div>
              <p className="font-semibold mb-14">Yang Menyerahkan,</p>
              <p className="font-bold underline uppercase text-black">
                {formData.pihak1Nama || formData.pengirimNama || "AHMAD DENDY SYAPUTRA"}
              </p>
              <p className="text-[11px] text-gray-700">
                {formData.pihak1Jabatan || formData.pengirimJabatan || "Staff Pengadaan dan Logistik"}
              </p>
            </div>

            <div>
              <p className="font-semibold mb-14">Mengetahui,</p>
              <p className="font-bold underline uppercase text-black">
                {formData.pihakMengetahuiNama || formData.mengetahuiNama || "ZONI RAHMAWAN PUTRA"}
              </p>
              <p className="text-[11px] text-gray-600">
                {formData.pihakMengetahuiJabatan || formData.mengetahuiJabatan || "Kabag Pengadaan dan Logistik"}
              </p>
            </div>
          </div>
        </div>

        {/* Official Footer PT PEGADAIAN - Pinned to bottom of A4 paper */}
        <div className="official-footer pt-3 border-t-2 border-black text-black mt-auto">
          <p className="font-bold text-xs uppercase mb-0.5">PT. PEGADAIAN</p>
          <p className="text-[11px] text-gray-700 leading-tight">Kantor Wilayah VIII Jakarta 1</p>
          <p className="text-[11px] text-gray-700 leading-tight">Jl. Senen Raya No. 36 Jakarta Pusat 10410</p>
          <p className="text-[11px] text-gray-700 leading-tight">Telp : (021) 3840229 &nbsp;&nbsp;&nbsp;&nbsp; Fax : (021) 3454116</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewView;
