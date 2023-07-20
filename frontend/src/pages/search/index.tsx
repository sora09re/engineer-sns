import type { NextPage } from "next";

import { Search } from "@/components/Search/Search";
import type { UserProps } from "@/types/user";

const SearchPage: NextPage<UserProps> = () => {
  return <Search />;
};

export default SearchPage;
