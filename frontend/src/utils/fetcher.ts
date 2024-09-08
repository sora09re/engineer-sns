import { callGetApi } from "@/utils/callApi";

export const fetcher = async (url: string) => {
  const result = await callGetApi(url);
  return result;
};
