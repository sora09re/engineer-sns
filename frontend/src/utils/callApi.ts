import axios from "axios";

import { apiUrl } from "@/utils/baseUrl";

export const callPostApi = async (
  endpoint: string,
  data: any,
  token?: string
) => {
  await axios.post(`${apiUrl}${endpoint}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
