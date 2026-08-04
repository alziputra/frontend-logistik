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

export const getSpkHistories = async () => {
  const response = await apiClient.get('/spk-histories?limit=10000');
  return extractArray(response.data);
};

export const addSpkHistory = async (formData) => {
  const response = await apiClient.post('/spk-histories', formData);
  return response.data;
};
