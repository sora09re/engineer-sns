import { Box, Center, Loader, Tabs, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useState } from "react";

import { PostsList } from "@/components/PostsList/PostsList";
import { UsersList } from "@/components/UsersList/UsersList";
import { useSearch } from "@/hooks/useSearch";
import type { User } from "@/types/user";

interface SearchProps {
  currentUser: User;
}

export const Search = ({ currentUser }: SearchProps) => {
  const [keyword, setKeyword] = useState("");

  const {
    data: searchUserResults,
    error: searchUserError,
    isLoading: isLoadingSearchUser,
  } = useSearch(keyword, "users");

  const {
    data: searchPostResults,
    error: searchPostError,
    isLoading: isLoadingSearchPost,
  } = useSearch(keyword, "posts");

  if (searchUserError) {
    console.error("Error fetching search user results:", searchUserError);
  }
  if (searchPostError) {
    console.error("Error fetching search post results:", searchPostError);
  }

  return (
    <Box p="md" style={{ height: "100vh" }}>
      <TextInput
        icon={<IconSearch />}
        placeholder="キーワード検索"
        value={keyword}
        onChange={(e) => {
          return setKeyword(e.target.value);
        }}
      />
      <Tabs defaultValue="post" mt="md" style={{ height: "100%" }}>
        <Tabs.List grow position="center">
          <Tabs.Tab value="post">投稿</Tabs.Tab>
          <Tabs.Tab value="account">アカウント</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="post" style={{ height: "80vh" }}>
          {isLoadingSearchPost ? (
            <Center mt={300}>
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
            <Center mt={300}>
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
