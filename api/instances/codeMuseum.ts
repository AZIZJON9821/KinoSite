import axios from "axios";
export const baseURL = typeof window === "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL || "http://51.20.250.43:3000")
  : "/api-backend";

export const customAxios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

