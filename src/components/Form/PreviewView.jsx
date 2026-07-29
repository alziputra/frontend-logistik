import React from "react";
import { ArrowLeft } from "lucide-react";

const PreviewView = ({
  formData = {},
  items = [],
  activeTransaction = null,
  setView = () => {},
  handleSaveTransaction = () => {},
  isSaving = false,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white mt-6 shadow-xl relative text-slate-900">
      <div className="print:hidden p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10">
        <button
          onClick={() => setView("form")}
          className="flex items-center gap-2 text-slate-200 bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-700 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Edit Kembali
        </button>
        <button
          onClick={handleSaveTransaction}
          disabled={isSaving}
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-70"
        >
          {isSaving ? "Menyimpan..." : "Submit Transaction"}
        </button>
      </div>

      <div className="p-8 sm:p-12 bg-white text-sm relative" id="printable-area">
        <div className="flex items-center justify-end mb-8 border-b-[3px] border-black pb-5">
          <div className="text-right">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900 leading-tight">
              Departemen Logistik
            </h1>
            <p className="text-gray-600">Sistem Informasi Manajemen Barang</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold underline uppercase text-gray-900 leading-tight">
            Berita Acara Serah Terima {formData.jenisTransaksi}
          </h2>
          <p className="text-gray-700 mt-1">Nomor: {formData.nomorSurat}</p>
        </div>

        <table className="w-full border-collapse mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-black py-2 px-2 text-center w-[5%]">No</th>
              <th className="border border-black py-2 px-2 text-left w-[25%]">Nama Barang</th>
              <th className="border border-black py-2 px-2 text-left w-[15%]">S/N</th>
              <th className="border border-black py-2 px-2 text-center w-[8%]">Qty</th>
              <th className="border border-black py-2 px-2 text-center w-[12%]">Satuan</th>
              <th className="border border-black py-2 px-2 text-left w-[20%]">Outlet Tujuan</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-black py-1 px-2 text-center">{index + 1}</td>
                <td className="border border-black py-1 px-2">{item.nama}</td>
                <td className="border border-black py-1 px-2">{item.sn}</td>
                <td className="border border-black py-1 px-2 text-center">{item.kuantitas}</td>
                <td className="border border-black py-1 px-2 text-center">{item.satuan}</td>
                <td className="border border-black py-1 px-2">{item.outlet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewView;
