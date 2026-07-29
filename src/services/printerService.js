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

export const getPrinter = async () => {
  const response = await apiClient.get('/printer?limit=10000');
  return extractArray(response.data);
};

export const addPrinter = async (formData) => {
  const response = await apiClient.post('/printer', formData);
  return response.data;
};

export const updatePrinter = async (id, formData) => {
  const response = await apiClient.put(`/printer/${id}`, formData);
  return response.data;
};

export const deletePrinter = async (id) => {
  const response = await apiClient.delete(`/printer/${id}`);
  return response.data;
};

export const importPrinterCSV = async (rows) => {
  if (!rows || rows.length === 0) throw new Error("File CSV kosong");
  const response = await apiClient.post('/printer/import', { rows });
  return response.data;
};
