import axios from "axios";
// export const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";
export const baseURL = "/api-backend";

export const customAxios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

