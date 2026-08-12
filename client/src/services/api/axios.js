import api from "./api";

const api = api.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

export default api;