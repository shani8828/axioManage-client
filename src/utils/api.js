import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Simple in-memory cache for GET requests
const cache = new Map();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      cache.clear(); // Clear cache on logout
    }
    return Promise.reject(err.response?.data?.message || err.message);
  }
);

// Save the original methods
const originalGet = api.get;
const originalPost = api.post;
const originalPut = api.put;
const originalPatch = api.patch;
const originalDelete = api.delete;

api.get = async (url, config = {}) => {
  if (!config.skipCache && cache.has(url)) {
    return Promise.resolve(cache.get(url));
  }
  const response = await originalGet.call(api, url, config);
  cache.set(url, response);
  return response;
};

const invalidateCache = (url) => {
  if (url) {
    // Basic invalidation: clear any cache key that shares the base path (e.g. /diary)
    const basePath = url.split("?")[0].split("/")[1]; 
    if (basePath) {
      for (const key of cache.keys()) {
        if (key.includes(`/${basePath}`)) {
          cache.delete(key);
        }
      }
      return;
    }
  }
  cache.clear();
};

api.post = async (url, data, config) => {
  const response = await originalPost.call(api, url, data, config);
  invalidateCache(url);
  return response;
};

api.put = async (url, data, config) => {
  const response = await originalPut.call(api, url, data, config);
  invalidateCache(url);
  return response;
};

api.patch = async (url, data, config) => {
  const response = await originalPatch.call(api, url, data, config);
  invalidateCache(url);
  return response;
};

api.delete = async (url, config) => {
  const response = await originalDelete.call(api, url, config);
  invalidateCache(url);
  return response;
};

// Expose manual cache clearer if needed elsewhere
api.clearCache = () => cache.clear();

export default api;