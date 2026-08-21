import axios from "axios";

// En local: Next.js proxea /api/* → https://kickshub.onrender.com/api/* (evita CORS)
// En Render (producción): la var de entorno apunta directo al backend
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
