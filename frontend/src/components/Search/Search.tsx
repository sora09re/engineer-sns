import { Box, Center, Loader, Tabs, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import error from "next/error";
import { useState } from "react";
import useSWR from "swr";

import { PostsList } from "@/components/PostsList/PostsList";
import { UsersList } from "@/components/UsersList/UsersList";
import { useSearchPosts } from "@/hooks/useSearchPosts";
import type { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";

interface SearchProps {
  currentUser: User;
}

export const Search = ({ currentUser }: SearchProps) => {
  const [keyword, setKeyword] = useState("");

  const {
    data: searchUserResults,
    error: searchUserError,
    isLoading: isLoadingSearchUser,
  } = useSWR(`/api/search/users?keyword=${keyword}`, fetcher);

  const {
    data: searchPostResults,
    error: searchPostError,
    isLoading: isLoadingSearchPost,
  } = useSearchPosts(keyword);

  if (searchUserError || searchPostError) {
    console.error("Error fetching search results:", error);
  }

  return (
    <Box p="md">
      <TextInput
        icon={<IconSearch />}
        placeholder="キーワード検索"
        value={keyword}
        onChange={(e) => {
          return setKeyword(e.target.value);
        }}
      />
      <Tabs defaultValue="post" mt="md">
        <Tabs.List grow position="center">
          <Tabs.Tab value="post">投稿</Tabs.Tab>
          <Tabs.Tab value="account">アカウント</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="post">
          {isLoadingSearchPost ? (
            <Center mt={200}>
              <Loader />
            </Center>
          ) : (
            <PostsList
              currentUserId={currentUser.id}
              posts={searchPostResults}
              keyword={keyword}
            />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="account">
          {isLoadingSearchUser ? (
            <Center mt={200}>
              <Loader />
            </Center>
          ) : (
            <UsersList
              users={searchUserResults}
              currentUserId={currentUser.id}
            />
          )}
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
