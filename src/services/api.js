// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:8000/store/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
