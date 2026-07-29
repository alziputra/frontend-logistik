import React, { useState, useEffect } from "react";
import {
  FileText, ArrowRight, Plus, Trash2, AlertCircle,
  PackageCheck, PackageMinus, Hash, MapPin, Calendar, ClipboardList, ChevronDown,
} from "lucide-react";

const NOMOR_PATTERN = /^\d{3}\/\d{5}\.\d{2}\/\d{2}\/\d{4}$/;

const isNomorValid = (nomor) => {
  if (!nomor || !NOMOR_PATTERN.test(nomor)) return false;
  return nomor.split("/")[0] !== "000";
};

const Field = ({ label, icon: Icon, children, className = "" }) => (
  <div className={className}>
    {label && (
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
    )}
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-500";

const FormView = ({
  formData = {},
  handleInputChange = () => {},
  items = [],
  handleItemChange = () => {},
  addItem = () => {},
  removeItem = () => {},
  setView = () => {},
  inventory = [],
  outlets = [],
}) => {
  const [nomorUrut, setNomorUrut] = useState("");
  const [jenisTransaksi, setJenisTransaksi] = useState(
    formData.jenisTransaksi || "Barang Keluar"
  );

  useEffect(() => {
    if (formData.nomorSurat) {
      const match = formData.nomorSurat.match(/^(\d{3})/);
      if (match) {
        setNomorUrut(match[1]);
      } else {
        setNomorUrut("");
      }
    } else {
      setNomorUrut("");
    }
  }, [formData.nomorSurat]);

  useEffect(() => {
    if (formData.jenisTransaksi) {
      setJenisTransaksi(formData.jenisTransaksi);
    } else {
      setJenisTransaksi("Barang Keluar");
    }
  }, [formData.jenisTransaksi]);

  const tahun = new Date().getFullYear();
  const suffix = `/00108.00/04/${tahun}`;

  const handleNomorChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 3);
    setNomorUrut(raw);
    if (!raw || ["0", "00", "000"].includes(raw)) {
      handleInputChange({ target: { name: "nomorSurat", value: "" } });
    } else {
      handleInputChange({
        target: { name: "nomorSurat", value: `${raw.padStart(3, "0")}${suffix}` },
      });
    }
  };

  const handleJenisChange = (jenis) => {
    setJenisTransaksi(jenis);
    handleInputChange({ target: { name: "jenisTransaksi", value: jenis } });
  };

  const nomorIsEmpty = !formData.nomorSurat;
  const nomorIs000 = formData.nomorSurat?.startsWith("000/");
  const nomorIsValid = isNomorValid(formData.nomorSurat);
  const canProceed = nomorIsValid;

  const isKeluar = jenisTransaksi === "Barang Keluar";

  return (
    <div className="max-w-6xl mx-auto mt-4 print:hidden">
      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 mb-4 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 leading-tight">Buat Surat Serah Terima</h2>
            <p className="text-xs text-slate-400 mt-0.5">Isi semua data dengan benar sebelum lanjut ke preview</p>
          </div>
        </div>
        <button
          onClick={() => canProceed && setView("preview")}
          disabled={!canProceed}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
        >
          Lanjut ke Preview <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 mb-4 p-6">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-500 mb-4">
          Informasi Dokumen
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <Field label="Jenis Transaksi">
              <div className="flex gap-2 mt-0.5">
                <button
                  type="button"
                  onClick={() => handleJenisChange("Barang Keluar")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${isKeluar
                      ? "bg-rose-950/80 border-rose-800 text-rose-300"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                >
                  <PackageMinus className="w-3.5 h-3.5" /> Keluar
                </button>
                <button
                  type="button"
                  onClick={() => handleJenisChange("Barang Masuk")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${!isKeluar
                      ? "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" /> Masuk
                </button>
              </div>
            </Field>
          </div>

          <div className="md:col-span-5">
            <Field label="Nomor Surat" icon={Hash}>
              <div
                className={`flex items-center rounded-lg border overflow-hidden transition-all ${nomorIsValid
                    ? "border-emerald-500 bg-slate-800"
                    : nomorIs000
                      ? "border-rose-500 bg-slate-800"
                      : "border-slate-700 bg-slate-800"
                  }`}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="000"
                  value={nomorUrut}
                  onChange={handleNomorChange}
                  className="w-16 py-2 pl-3 text-center font-mono font-bold text-base outline-none bg-transparent text-slate-100"
                />
                <span className="text-slate-400 font-mono text-xs px-2 border-l border-slate-700 bg-slate-800 py-2 select-none">
                  {suffix}
                </span>
              </div>
              {nomorIs000 && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1.5">
                  <AlertCircle className="w-3 h-3" /> Nomor tidak boleh 000
                </p>
              )}
              {!nomorIsEmpty && nomorIsValid && (
                <p className="text-[11px] text-emerald-400 mt-1.5 font-mono">
                  ✓ {formData.nomorSurat}
                </p>
              )}
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Tanggal" icon={Calendar}>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal || ''}
                onChange={handleInputChange}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Lokasi" icon={MapPin}>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi || ''}
                onChange={handleInputChange}
                placeholder="Gudang Pusat"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 mb-4 p-6">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-500 mb-4">
          Pihak yang Terlibat
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">1</div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Yang Menyerahkan</p>
            </div>
            <div className="space-y-2">
              <input name="pengirimNama" value={formData.pengirimNama || ''} onChange={handleInputChange} placeholder="Nama lengkap" className={inputCls} />
              <input name="pengirimJabatan" value={formData.pengirimJabatan || ''} onChange={handleInputChange} placeholder="Jabatan" className={inputCls} />
              <input name="pengirimInstansi" value={formData.pengirimInstansi || ''} onChange={handleInputChange} placeholder="Instansi / Area" className={inputCls} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">2</div>
              <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Mengetahui</p>
            </div>
            <div className="space-y-2">
              <input name="mengetahuiNama" value={formData.mengetahuiNama || ''} onChange={handleInputChange} placeholder="Nama lengkap" className={inputCls} />
              <input name="mengetahuiJabatan" value={formData.mengetahuiJabatan || ''} onChange={handleInputChange} placeholder="Jabatan" className={inputCls} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-[10px] font-bold">3</div>
              <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">Yang Menerima</p>
            </div>
            <div className="space-y-2">
              <input name="penerimaNama" value={formData.penerimaNama || ''} onChange={handleInputChange} placeholder="Nama lengkap" className={inputCls} />
              <input name="penerimaJabatan" value={formData.penerimaJabatan || ''} onChange={handleInputChange} placeholder="Jabatan" className={inputCls} />
              <input name="penerimaInstansi" value={formData.penerimaInstansi || ''} onChange={handleInputChange} placeholder="Instansi / Area" className={inputCls} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400">
              Daftar Barang
            </p>
            <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {items.length} baris
            </span>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Baris
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-3 py-3 text-center w-12">No</th>
                  <th className="px-3 py-3 w-[25%]">Nama Barang</th>
                  <th className="px-3 py-3 w-[15%]">S/N</th>
                  <th className="px-3 py-3 text-center w-20">Qty</th>
                  <th className="px-3 py-3 w-28">Satuan</th>
                  <th className="px-3 py-3 w-[20%]">Outlet Tujuan</th>
                  <th className="px-3 py-3 min-w-[150px]">Keterangan</th>
                  <th className="px-3 py-3 w-12 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-2 text-center text-xs font-mono text-slate-500 font-semibold">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={item.nama || ''}
                        onChange={(e) => handleItemChange(item.id, "nama", e.target.value)}
                        className="w-full text-xs px-2 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-100 outline-none focus:border-emerald-500"
                        placeholder="Ketik nama barang..."
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={item.sn || ''}
                        onChange={(e) => handleItemChange(item.id, "sn", e.target.value)}
                        className="w-full text-xs font-mono px-2 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-100 outline-none focus:border-emerald-500"
                        placeholder="Serial number"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.kuantitas || 1}
                        onChange={(e) => handleItemChange(item.id, "kuantitas", e.target.value)}
                        className="w-full text-xs text-center px-2 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-100 outline-none focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={item.satuan || 'Pcs'}
                        onChange={(e) => handleItemChange(item.id, "satuan", e.target.value)}
                        className="w-full text-xs px-2 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option>Pcs</option>
                        <option>Unit</option>
                        <option>Box</option>
                        <option>Set</option>
                        <option>Lembar</option>
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={item.outlet || ""}
                        onChange={(e) => handleItemChange(item.id, "outlet", e.target.value)}
                        className="w-full text-xs px-2 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-100 outline-none focus:border-emerald-500"
                        placeholder="Outlet..."
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={item.keterangan || ''}
                        onChange={(e) => handleItemChange(item.id, "keterangan", e.target.value)}
                        className="w-full text-xs px-2 py-2 border border-slate-700 rounded-md bg-slate-800 text-slate-100 outline-none focus:border-emerald-500"
                        placeholder="Catatan..."
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="w-7 h-7 mx-auto flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 disabled:opacity-30 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormView;
