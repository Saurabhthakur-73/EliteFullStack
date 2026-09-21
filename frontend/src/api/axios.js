import axios from "axios";

// In production (Vercel), the frontend and backend live on the SAME domain,
// and vercel.json's rewrites route /api/* to the backend service.
// So a relative "/api" always works correctly — no hardcoded localhost.
//
// In local dev, this will hit http://localhost:5173/api (your Vite dev server),
// which won't reach your backend on port 5000 directly. If you want local dev
// to keep working with `npm run dev` on both frontend and backend, either:
//   (a) add a proxy in vite.config.js for "/api" -> "http://localhost:5000", or
//   (b) use an environment variable so dev still points to localhost:5000.
//
// Option (b) shown below — works in both environments automatically:
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach JWT token automatically if present
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;