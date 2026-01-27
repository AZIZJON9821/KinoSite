import axios from "axios";
export const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.11:3000";

export const customAxios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

