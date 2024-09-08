import type { AxiosRequestConfig } from "axios";
import axios from "axios";

import { apiUrl } from "@/utils/baseUrl";

export const callGetApi = async (
  endpoint: string,
  token?: string,
  options?: AxiosRequestConfig
) => {
  const response = await axios.get(endpoint, {
    ...options,
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  return response.data;
};

export const callPostApi = async (
  endpoint: string,
  data: any,
  token?: string,
  options?: AxiosRequestConfig
) => {
  const response = await axios.post(endpoint, data, {
    ...options,
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  return response.data;
};
