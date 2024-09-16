import { callGetApi } from "@/utils/callApi";

type TokenFetcherProps = {
  token: string;
  url: string;
};

export const fetcher = async (url: string) => {
  const result = await callGetApi(url);
  return result;
};

export const tokenFetcher = async (props: TokenFetcherProps) => {
  const { token, url } = props;

  let result;
  if (token) {
    result = await callGetApi(url, token);
  }

  return result;
};
