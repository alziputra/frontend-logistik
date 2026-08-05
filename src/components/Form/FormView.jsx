import React, { useState, useEffect } from "react";
import {
  FileText, ArrowRight, Plus, Trash2, AlertCircle,
  PackageCheck, PackageMinus, Hash, MapPin, Calendar, ClipboardList, Building2,
} from "lucide-react";

const NOMOR_PATTERN = /^\d{3}\/\d{5}\.\d{2}\/\d{2}\/\d{4}$/;

const isNomorValid = (nomor) => {
  if (!nomor || !NOMOR_PATTERN.test(nomor)) return false;
  return nomor.split("/")[0] !== "000";
};

const Field = ({ label, icon: Icon, children, className = "" }) => (
  <div className={className}>
    {label && (
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />}
        {label}
      </label>
    )}
    {children}
  </div>
);

const inputCls =
  "w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium shadow-sm";

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

  const totalQty = items.reduce(
    (sum, item) => sum + (Number(item.jumlah || item.kuantitas) || 0),
    0
  );
  const filledCount = items.filter(
    (i) => (i.namaBarang || i.nama || "").trim() !== ""
  ).length;

  return (
    <div className="max-w-6xl mx-auto mt-4 print:hidden">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-4 px-6 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Buat Surat Serah Terima</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Isi semua data dengan benar sebelum lanjut ke preview</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => canProceed && setView("preview")}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${canProceed
            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95"
            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/60 cursor-not-allowed"
            }`}
        >
          Lanjut ke Preview <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* INFORMASI DOKUMEN */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Informasi Dokumen
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Jenis Transaksi */}
            <div className="md:col-span-3">
              <Field label="Jenis Transaksi" icon={ClipboardList}>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleJenisChange("Barang Keluar")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${isKeluar
                      ? "bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                  >
                    <PackageMinus className="w-3.5 h-3.5" /> Keluar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleJenisChange("Barang Masuk")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${!isKeluar
                      ? "bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                  >
                    <PackageCheck className="w-3.5 h-3.5" /> Masuk
                  </button>
                </div>
              </Field>
            </div>

            {/* Nomor Surat */}
            <div className="md:col-span-5">
              <Field label="Nomor Surat" icon={Hash}>
                <div
                  className={`flex items-center rounded-xl border overflow-hidden transition-all ${nomorIsValid
                    ? "border-emerald-500 bg-white dark:bg-slate-800 shadow-sm"
                    : nomorIs000
                      ? "border-rose-500 bg-white dark:bg-slate-800 shadow-sm"
                      : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
                    }`}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    placeholder="000"
                    value={nomorUrut}
                    onChange={handleNomorChange}
                    className="w-20 py-2.5 pl-3 text-center font-mono font-bold text-base outline-none bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                  <span className="text-slate-600 dark:text-slate-400 font-mono text-xs px-3 border-l border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 py-2.5 select-none truncate">
                    {suffix}
                  </span>
                </div>
                {nomorIs000 && (
                  <p className="flex items-center gap-1 text-[11px] text-rose-500 dark:text-rose-400 mt-1.5 font-medium">
                    <AlertCircle className="w-3 h-3" /> Nomor tidak boleh 000
                  </p>
                )}
                {!nomorIsEmpty && nomorIsValid && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 font-mono font-semibold">
                    ✓ {formData.nomorSurat}
                  </p>
                )}
              </Field>
            </div>

            {/* Tanggal */}
            <div className="md:col-span-4">
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

            {/* Lokasi */}
            <div className="md:col-span-4">
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

            {/* Kolom Khusus: Tujuan (Instansi / Outlet) */}
            <div className="md:col-span-8">
              <Field label="Tujuan (Instansi / Outlet)" icon={Building2}>
                <input
                  type="text"
                  name="tujuan"
                  list="outlet-options-list"
                  value={formData.tujuan || formData.outletTujuan || formData.pihak2Instansi || ""}
                  onChange={handleInputChange}
                  placeholder="Pilih dari daftar master instansi / outlet atau ketik manual..."
                  className={inputCls}
                />
                <datalist id="outlet-options-list">
                  {outlets.map((o, idx) => (
                    <option key={o.id || idx} value={o.nama || o.instansi || o.name || o.kode} />
                  ))}
                </datalist>
              </Field>
            </div>
          </div>
        </div>

        {/* PIHAK YANG TERLIBAT */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Pihak Yang Terlibat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Yang Menyerahkan */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">1</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Yang Menyerahkan</span>
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
            </div>

            {/* Card 2: Mengetahui */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">2</span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Mengetahui</span>
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
            </div>

            {/* Card 3: Yang Menerima */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">3</span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">Yang Menerima</span>
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
            </div>
          </div>
        </div>

        {/* DAFTAR BARANG */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-500" />
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Daftar Barang
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                {items.length} baris
              </span>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-600/20 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tambah Baris
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3 text-center w-12">No</th>
                  <th className="py-3 px-3 min-w-[180px]">Nama Barang</th>
                  <th className="py-3 px-3 w-32">S/N</th>
                  <th className="py-3 px-3 text-center w-20">Qty</th>
                  <th className="py-3 px-3 w-28">Satuan</th>
                  <th className="py-3 px-3 min-w-[160px]">Outlet Tujuan</th>
                  <th className="py-3 px-3 min-w-[160px]">Keterangan</th>
                  <th className="py-3 px-3 text-center w-14">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-slate-900/60">
                {items.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400 dark:text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        list={`inventory-list-${index}`}
                        value={item.namaBarang || item.nama || ""}
                        onChange={(e) => handleItemChange(index, "namaBarang", e.target.value)}
                        placeholder="Ketik atau pilih..."
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                      <datalist id={`inventory-list-${index}`}>
                        {inventory.map((inv, idx) => (
                          <option key={inv.id || idx} value={inv.nama || inv.namaBarang} />
                        ))}
                      </datalist>
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        value={item.sn || ""}
                        onChange={(e) => handleItemChange(index, "sn", e.target.value)}
                        placeholder="Serial number"
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min="1"
                        value={item.jumlah || item.kuantitas || 1}
                        onChange={(e) => handleItemChange(index, "jumlah", e.target.value)}
                        className="w-full px-2 py-1.5 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <select
                        value={item.satuan || "Pcs"}
                        onChange={(e) => handleItemChange(index, "satuan", e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-colors"
                      >
                        <option value="Pcs">Pcs</option>
                        <option value="Unit">Unit</option>
                        <option value="Set">Set</option>
                        <option value="Box">Box</option>
                        <option value="Paket">Paket</option>
                        <option value="Buah">Buah</option>
                        <option value="Roll">Roll</option>
                        <option value="Meter">Meter</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        list={`outlet-list-${index}`}
                        value={item.outlet || ""}
                        onChange={(e) => handleItemChange(index, "outlet", e.target.value)}
                        placeholder="Pilih outlet..."
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                      <datalist id={`outlet-list-${index}`}>
                        {outlets.map((o, idx) => (
                          <option key={o.id || idx} value={o.nama || o.instansi || o.name} />
                        ))}
                      </datalist>
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        value={item.keterangan || ""}
                        onChange={(e) => handleItemChange(index, "keterangan", e.target.value)}
                        placeholder="Catatan..."
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Table Summary Footer */}
            <div className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>{filledCount} barang diisi</span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                Total: <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{totalQty}</strong> unit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormView;
