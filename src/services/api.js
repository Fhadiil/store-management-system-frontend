// src/services/api.js
import axios from "axios";

const API_URL =
  "https://store-management-system-backend-wr2w.onrender.com/store/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },

  getSalesReport: (params) =>
    axios.get(
      "https://store-management-system-backend-wr2w.onrender.com/store/api/reports/sales/",
      { params }
    ),
  getInventoryReport: (params) =>
    axios.get(
      "https://store-management-system-backend-wr2w.onrender.com/store/api/reports/inventory/",
      { params }
    ),
  exportSalesReport: (params) =>
    axios.get(
      "https://store-management-system-backend-wr2w.onrender.com/store/api/reports/sales/export/",
      {
        params,
        responseType: "blob",
      }
    ),
});

export default api;
