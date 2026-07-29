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

export const getTransaksi = async () => {
  const response = await apiClient.get('/transaksi?limit=10000');
  return extractArray(response.data);
};

export const createTransaksi = async (data) => {
  const response = await apiClient.post('/transaksi', data);
  return response.data;
};

export const addTransaksi = createTransaksi;

export const updateTransaksi = async (id, data) => {
  const response = await apiClient.put(`/transaksi/${id}`, data);
  return response.data;
};

export const deleteTransaksi = async (id) => {
  const response = await apiClient.delete(`/transaksi/${id}`);
  return response.data;
};
