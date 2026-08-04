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

export const getAsetTanah = async () => {
  const response = await apiClient.get('/aset-tanah?limit=10000');
  return extractArray(response.data);
};

export const addAsetTanah = async (formData) => {
  const response = await apiClient.post('/aset-tanah', formData);
  return response.data;
};

export const updateAsetTanah = async (id, formData) => {
  const response = await apiClient.put(`/aset-tanah/${id}`, formData);
  return response.data;
};

export const deleteAsetTanah = async (id) => {
  const response = await apiClient.delete(`/aset-tanah/${id}`);
  return response.data;
};
