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
        const paddedMatch = match[1];
        if (nomorUrut.padStart(3, "0") !== paddedMatch) {
          setNomorUrut(paddedMatch);
        }
      }
    } else if (formData.nomorSurat === "") {
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
      const padded = raw.padStart(3, "0");
      handleInputChange({
        target: { name: "nomorSurat", value: `${padded}${suffix}` },
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
            <h2 className="text-base font-bold text-slate-100">Buat Surat Serah Terima</h2>
            <p className="text-xs text-slate-400">Isi semua data dengan benar sebelum lanjut ke preview</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => canProceed && setView("preview")}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${canProceed
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
              : "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed"
            }`}
        >
          Lanjut ke Preview <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* INFORMASI DOKUMEN */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Informasi Dokumen
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <Field label="Jenis Transaksi" icon={ClipboardList}>
                <div className="flex gap-2">
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

            <div className="md:col-span-4">
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
                    className="w-20 py-2 pl-3 text-center font-mono font-bold text-base outline-none bg-transparent text-slate-100 placeholder:text-slate-600"
                  />
                  <span className="text-slate-400 font-mono text-xs px-2 border-l border-slate-700 bg-slate-800 py-2 select-none truncate">
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
                  value={formData.tanggal || ""}
                  onChange={handleInputChange}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="md:col-span-3">
              <Field label="Lokasi" icon={MapPin}>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi || ""}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jakarta"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* PIHAK YANG TERLIBAT */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Pihak Yang Terlibat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <span className="text-xs font-bold text-emerald-400 uppercase">Yang Menyerahkan</span>
              </div>
              <input
                type="text"
                name="pihak1Nama"
                value={formData.pihak1Nama || ""}
                onChange={handleInputChange}
                placeholder="Nama lengkap"
                className={inputCls}
              />
              <input
                type="text"
                name="pihak1Jabatan"
                value={formData.pihak1Jabatan || ""}
                onChange={handleInputChange}
                placeholder="Jabatan"
                className={inputCls}
              />
              <input
                type="text"
                name="pihak1Instansi"
                value={formData.pihak1Instansi || ""}
                onChange={handleInputChange}
                placeholder="Instansi / Area"
                className={inputCls}
              />
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <span className="text-xs font-bold text-purple-400 uppercase">Mengetahui</span>
              </div>
              <input
                type="text"
                name="pihakMengetahuiNama"
                value={formData.pihakMengetahuiNama || ""}
                onChange={handleInputChange}
                placeholder="Nama lengkap"
                className={inputCls}
              />
              <input
                type="text"
                name="pihakMengetahuiJabatan"
                value={formData.pihakMengetahuiJabatan || ""}
                onChange={handleInputChange}
                placeholder="Jabatan"
                className={inputCls}
              />
              <input
                type="text"
                name="pihakMengetahuiInstansi"
                value={formData.pihakMengetahuiInstansi || ""}
                onChange={handleInputChange}
                placeholder="Instansi / Area"
                className={inputCls}
              />
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                <span className="text-xs font-bold text-teal-400 uppercase">Yang Menerima</span>
              </div>
              <input
                type="text"
                name="pihak2Nama"
                value={formData.pihak2Nama || ""}
                onChange={handleInputChange}
                placeholder="Nama lengkap"
                className={inputCls}
              />
              <input
                type="text"
                name="pihak2Jabatan"
                value={formData.pihak2Jabatan || ""}
                onChange={handleInputChange}
                placeholder="Jabatan"
                className={inputCls}
              />
              <input
                type="text"
                name="pihak2Instansi"
                value={formData.pihak2Instansi || ""}
                onChange={handleInputChange}
                placeholder="Instansi / Area"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* DAFTAR BARANG */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Daftar Barang ({items.length})
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Barang
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800 items-center"
              >
                <div className="md:col-span-4">
                  <input
                    type="text"
                    value={item.namaBarang || ""}
                    onChange={(e) => handleItemChange(index, "namaBarang", e.target.value)}
                    placeholder="Nama Barang"
                    className={inputCls}
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="number"
                    value={item.jumlah || ""}
                    onChange={(e) => handleItemChange(index, "jumlah", e.target.value)}
                    placeholder="Jumlah"
                    className={inputCls}
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={item.satuan || ""}
                    onChange={(e) => handleItemChange(index, "satuan", e.target.value)}
                    placeholder="Satuan (Unit/Pcs)"
                    className={inputCls}
                  />
                </div>
                <div className="md:col-span-3">
                  <input
                    type="text"
                    value={item.keterangan || ""}
                    onChange={(e) => handleItemChange(index, "keterangan", e.target.value)}
                    placeholder="Keterangan / Kondisi"
                    className={inputCls}
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-rose-400 hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormView;
