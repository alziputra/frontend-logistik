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

export const getPengamananKorporasi = async () => {
  const response = await apiClient.get('/pengamanan-korporasi?limit=10000');
  return extractArray(response.data);
};

export const addPengamananKorporasi = async (formData) => {
  const response = await apiClient.post('/pengamanan-korporasi', formData);
  return response.data;
};

export const updatePengamananKorporasi = async (id, formData) => {
  const response = await apiClient.put(`/pengamanan-korporasi/${id}`, formData);
  return response.data;
};

export const deletePengamananKorporasi = async (id) => {
  const response = await apiClient.delete(`/pengamanan-korporasi/${id}`);
  return response.data;
};
