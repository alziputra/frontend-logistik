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

export const getVendors = async () => {
  const response = await apiClient.get('/vendors?limit=10000');
  return extractArray(response.data);
};

export const addVendor = async (formData) => {
  const response = await apiClient.post('/vendors', formData);
  return response.data;
};

export const updateVendor = async (id, formData) => {
  const response = await apiClient.put(`/vendors/${id}`, formData);
  return response.data;
};

export const deleteVendor = async (id) => {
  const response = await apiClient.delete(`/vendors/${id}`);
  return response.data;
};
