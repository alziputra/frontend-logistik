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

export const getRenovasi = async () => {
  const response = await apiClient.get('/renovasi?limit=10000');
  return extractArray(response.data);
};

export const addRenovasi = async (formData) => {
  const response = await apiClient.post('/renovasi', formData);
  return response.data;
};

export const updateRenovasi = async (id, formData) => {
  const response = await apiClient.put(`/renovasi/${id}`, formData);
  return response.data;
};

export const deleteRenovasi = async (id) => {
  const response = await apiClient.delete(`/renovasi/${id}`);
  return response.data;
};
