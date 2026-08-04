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

export const getMenuSewa = async () => {
  const response = await apiClient.get('/menu-sewa?limit=10000');
  return extractArray(response.data);
};

export const addMenuSewa = async (formData) => {
  const response = await apiClient.post('/menu-sewa', formData);
  return response.data;
};

export const updateMenuSewa = async (id, formData) => {
  const response = await apiClient.put(`/menu-sewa/${id}`, formData);
  return response.data;
};

export const deleteMenuSewa = async (id) => {
  const response = await apiClient.delete(`/menu-sewa/${id}`);
  return response.data;
};
