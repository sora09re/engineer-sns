import { callGetApi } from "@/utils/callApi";

export const fetcher = async (url: string) => {
  const result = await callGetApi(url);
  return result;
};

export const tokenFetcher = async (urlWithToken: string) => {
  const [url, token] = urlWithToken.split("?token=");

  let result;
  if (token) {
    result = await callGetApi(url, token);
  }

  return result;
};
