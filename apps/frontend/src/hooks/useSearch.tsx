import useSWR from "swr";

import { fetcher } from "@/utils/fetcher";

type SearchType = "users" | "posts";

export const useSearch = (
  keyword: string | undefined,
  searchType: SearchType
) => {
  const shouldFetch = keyword !== undefined && keyword !== "";
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/search/${searchType}?keyword=${keyword}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
};
