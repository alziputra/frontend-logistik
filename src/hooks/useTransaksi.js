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

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let updated = { ...item, [field]: value };
        if (field === "nama") {
          const found = inventory.find((i) => i.nama === value);
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
        penerimaNama: formData.penerimaNama,
        penerimaJabatan: formData.penerimaJabatan,
        penerimaInstansi: formData.penerimaInstansi,
        pengirimNama: formData.pengirimNama,
        pengirimJabatan: formData.pengirimJabatan,
        pengirimInstansi: formData.pengirimInstansi,
        mengetahuiNama: formData.mengetahuiNama,
        mengetahuiJabatan: formData.mengetahuiJabatan,
        lokasi: formData.lokasi,
        items: items.map((item) => ({
          nama: item.nama,
          kuantitas: Number(item.kuantitas),
          satuan: item.satuan,
          sn: item.sn || null,
          keterangan: item.keterangan || null,
          outlet: item.outlet || null,
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
