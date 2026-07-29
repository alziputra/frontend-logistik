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

export const getInstansi = async () => {
  const response = await apiClient.get('/instansi?limit=10000');
  const items = extractArray(response.data);
  return items.map((item) => ({
    ...item,
    code: item.kode || item.code || "",
  }));
};

export const addInstansi = async (formData) => {
  const payload = {
    kode: formData.kode || formData.code || "",
    nama: formData.nama || "",
  };
  const response = await apiClient.post('/instansi', payload);
  return response.data;
};

export const updateInstansi = async (id, formData) => {
  const payload = {
    kode: formData.kode || formData.code || "",
    nama: formData.nama || "",
  };
  const response = await apiClient.put(`/instansi/${id}`, payload);
  return response.data;
};

export const deleteInstansi = async (id) => {
  const response = await apiClient.delete(`/instansi/${id}`);
  return response.data;
};
