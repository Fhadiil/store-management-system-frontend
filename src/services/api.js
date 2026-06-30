// src/services/api.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/store/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.getSalesReport = (params) => api.get("/reports/sales/", { params });

api.getInventoryReport = (params) => api.get("/reports/inventory/", { params });

api.exportSalesReport = (params) =>
  api.get("/reports/sales/export/", { params, responseType: "blob" });

export default api;
