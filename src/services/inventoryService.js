import apiClient from '../api/axios';

const extractArray = (resData) => {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData;
  if (resData.data) {
    if (Array.isArray(resData.data)) return resData.data;
    for (const key of Object.keys(resData.data)) {
      if (Array.isArray(resData.data[key])) return resData.data[key];
    }
  }
  for (const key of Object.keys(resData)) {
    if (Array.isArray(resData[key])) return resData[key];
  }
  return [];
};

export const getInventory = async () => {
  const response = await apiClient.get('/asets?limit=10000');
  const items = extractArray(response.data);
  return items.map((item) => ({
    ...item,
    kuantitas: item.stok !== undefined ? item.stok : (item.kuantitas || 0),
  }));
};

export const addInventory = async (formData) => {
  const payload = {
    nama: formData.nama,
    stok: formData.stok !== undefined ? Number(formData.stok) : Number(formData.kuantitas || 0),
    satuan: formData.satuan || "Pcs",
    vendorId: formData.vendorId || null,
    no_spk: formData.no_spk || null,
    no_pks: formData.no_pks || null,
    tanggal_mulai: formData.tanggal_mulai || null,
    tanggal_selesai: formData.tanggal_selesai || null,
    status: formData.status || "Sewa Berjalan",
    masa_sewa_bulan: Number(formData.masa_sewa_bulan || 0),
  };
  const response = await apiClient.post('/asets', payload);
  return response.data;
};

export const updateInventory = async (id, formData) => {
  const payload = {
    nama: formData.nama,
    stok: formData.stok !== undefined ? Number(formData.stok) : Number(formData.kuantitas || 0),
    satuan: formData.satuan || "Pcs",
    vendorId: formData.vendorId || null,
    no_spk: formData.no_spk || null,
    no_pks: formData.no_pks || null,
    tanggal_mulai: formData.tanggal_mulai || null,
    tanggal_selesai: formData.tanggal_selesai || null,
    status: formData.status || "Sewa Berjalan",
    masa_sewa_bulan: Number(formData.masa_sewa_bulan || 0),
  };
  const response = await apiClient.put(`/asets/${id}`, payload);
  return response.data;
};

export const deleteInventory = async (id) => {
  const response = await apiClient.delete(`/asets/${id}`);
  return response.data;
};
