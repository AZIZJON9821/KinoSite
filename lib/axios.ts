import axios from "axios";
import { getSession } from "next-auth/react";
// Actually, for client side we can just use localStorage or cookies-next if we prefer
// But usually httpOnly cookies are better. The prompt says "Store tokens securely".
// Let's use standard axios instance.

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const API_URL = "/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session && session.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
