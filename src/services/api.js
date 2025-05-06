// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:8000/store/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },

  getSalesReport: (params) =>
    axios.get("http://localhost:8000/store/api/reports/sales/", { params }),
  getInventoryReport: (params) =>
    axios.get("http://localhost:8000/store/api/reports/inventory/", { params }),
  exportSalesReport: (params) =>
    axios.get("http://localhost:8000/store/api/reports/sales/export/", {
      params,
      responseType: "blob",
    }),
});

export default api;
