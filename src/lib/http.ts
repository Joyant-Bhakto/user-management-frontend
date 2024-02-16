import axios from "axios";

export const apiClient = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_BASE,
})