import axios from "axios";
export const baseURL = typeof window === "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL || "https://kino-sayt-backend.onrender.com")
  : "/api-backend";

export const customAxios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

