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

export const getUsers = async () => {
  const response = await apiClient.get('/users?limit=10000');
  return extractArray(response.data);
};

export const addUser = async (formData) => {
  const response = await apiClient.post('/users', formData);
  return response.data;
};

export const updateUser = async (id, formData) => {
  const response = await apiClient.put(`/users/${id}`, formData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
