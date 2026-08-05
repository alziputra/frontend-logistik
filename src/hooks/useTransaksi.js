import { useState } from "react";
import { addTransaksi } from "../services/transaksiService";
import { createInitialFormData, createInitialItem } from "../constants";

export function useTransaksi({
  user,
  transactions = [],
  inventory = [],
  setTransactions = () => {},
  setInventory = () => {},
  setActivityLogs = () => {},
  showNotif = () => {},
  navigateTo = () => {},
}) {
  const [formData, setFormData] = useState(() => createInitialFormData());
  const [items, setItems] = useState(() => [createInitialItem()]);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const startNewDocument = (jenis = "Barang Keluar") => {
    setFormData({
      ...createInitialFormData(),
      nomorSurat: "",
      jenisTransaksi: jenis,
    });
    setItems([createInitialItem()]);
    setActiveTransaction(null);
    navigateTo("form");
  };

  const addItem = () => setItems((prev) => [...prev, createInitialItem()]);

  const removeItem = (target) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item, idx) => item.id !== target && idx !== target));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Sync aliases for backward compatibility
      if (name === "tujuan" || name === "outletTujuan") {
        updated.tujuan = value;
        updated.outletTujuan = value;
        updated.pihak2Instansi = value;
        updated.penerimaInstansi = value;
      }

      if (name === "pihak1Nama") updated.pengirimNama = value;
      if (name === "pengirimNama") updated.pihak1Nama = value;
      if (name === "pihak1Jabatan") updated.pengirimJabatan = value;
      if (name === "pengirimJabatan") updated.pihak1Jabatan = value;
      if (name === "pihak1Instansi") updated.pengirimInstansi = value;
      if (name === "pengirimInstansi") updated.pihak1Instansi = value;

      if (name === "pihakMengetahuiNama") updated.mengetahuiNama = value;
      if (name === "mengetahuiNama") updated.pihakMengetahuiNama = value;
      if (name === "pihakMengetahuiJabatan") updated.mengetahuiJabatan = value;
      if (name === "mengetahuiJabatan") updated.pihakMengetahuiJabatan = value;

      if (name === "pihak2Nama") updated.penerimaNama = value;
      if (name === "penerimaNama") updated.pihak2Nama = value;
      if (name === "pihak2Jabatan") updated.penerimaJabatan = value;
      if (name === "penerimaJabatan") updated.pihak2Jabatan = value;
      if (name === "pihak2Instansi" || name === "penerimaInstansi") {
        updated.pihak2Instansi = value;
        updated.penerimaInstansi = value;
        updated.tujuan = value;
        updated.outletTujuan = value;
      }
      return updated;
    });
  };

  const handleItemChange = (target, field, value) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (item.id !== target && idx !== target) return item;
        let updated = { ...item, [field]: value };

        if (field === "namaBarang") updated.nama = value;
        if (field === "nama") updated.namaBarang = value;
        if (field === "jumlah") updated.kuantitas = Number(value);
        if (field === "kuantitas") updated.jumlah = Number(value);

        if (field === "namaBarang" || field === "nama") {
          const found = inventory.find((i) => i.nama === value || i.namaBarang === value);
          if (found) updated.satuan = found.satuan;
        }
        return updated;
      })
    );
  };

  const handleSaveTransaction = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        nomorSurat: formData.nomorSurat,
        tanggal: formData.tanggal,
        jenisTransaksi: formData.jenisTransaksi,
        penerimaNama: formData.pihak2Nama || formData.penerimaNama || "",
        penerimaJabatan: formData.pihak2Jabatan || formData.penerimaJabatan || "",
        penerimaInstansi: formData.tujuan || formData.outletTujuan || formData.pihak2Instansi || formData.penerimaInstansi || "",
        pengirimNama: formData.pihak1Nama || formData.pengirimNama || "",
        pengirimJabatan: formData.pihak1Jabatan || formData.pengirimJabatan || "",
        pengirimInstansi: formData.pihak1Instansi || formData.pengirimInstansi || "",
        mengetahuiNama: formData.pihakMengetahuiNama || formData.mengetahuiNama || "",
        mengetahuiJabatan: formData.pihakMengetahuiJabatan || formData.mengetahuiJabatan || "",
        lokasi: formData.lokasi || "Jakarta",
        items: items.map((item) => ({
          nama: item.namaBarang || item.nama || "",
          kuantitas: Number(item.jumlah || item.kuantitas || 1),
          satuan: item.satuan || "Pcs",
          sn: item.sn || null,
          keterangan: item.keterangan || null,
          outlet: item.outlet || formData.tujuan || null,
        })),
      };

      const res = await addTransaksi(payload);
      const savedTrx = res?.transaction || res || payload;

      setTransactions((prev) => [savedTrx, ...prev]);
      setActiveTransaction(savedTrx);
      showNotif("Transaksi berhasil disimpan!", "success");
      navigateTo("riwayat");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Gagal menyimpan transaksi.";
      showNotif(errorMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    items,
    setItems,
    activeTransaction,
    setActiveTransaction,
    startNewDocument,
    addItem,
    removeItem,
    handleInputChange,
    handleItemChange,
    handleSaveTransaction,
    isSaving,
  };
}
