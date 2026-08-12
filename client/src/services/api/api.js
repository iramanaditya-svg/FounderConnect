import axios from "axios";

const api = axios.create({
    baseURL: "https://founder-connect-khf4.vercel.app/api/v1",
    withCredentials: true,
});

export default api;