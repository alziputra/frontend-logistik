import apiClient from '../api/axios';
import { parseIndoDateToISO } from "../utils/deviceUtils";

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

export const getKomputer = async () => {
  const response = await apiClient.get('/komputer?limit=10000');
  return extractArray(response.data);
};

export const addKomputer = async (formData) => {
  const response = await apiClient.post('/komputer', formData);
  return response.data;
};

export const updateKomputer = async (id, formData) => {
  const response = await apiClient.put(`/komputer/${id}`, formData);
  return response.data;
};

export const deleteKomputer = async (id) => {
  const response = await apiClient.delete(`/komputer/${id}`);
  return response.data;
};

export const importKomputerCSV = async (rows) => {
  if (!rows || rows.length === 0) throw new Error("File CSV kosong");
  const response = await apiClient.post('/komputer/import', { rows });
  return response.data;
};
