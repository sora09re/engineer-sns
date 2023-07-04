import { Box, Tabs, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";

import { UserItem } from "@/components/UserItem/UserItem";
import { Post } from "@/features/posts-feature/Post/Post";
import type { Post as PostType } from "@/types/post";
import type { User } from "@/types/user";

export const Search = () => {
  const [searchPostResults, setSearchPostResults] = useState<PostType[] | null>(
    null
  );
  const [searchUserResults, setSearchUserResults] = useState<User[] | null>(
    null
  );

  useEffect(() => {
    fetch(`/search/posts?query={query}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSearchPostResults(data);
      });
  }, []);

  useEffect(() => {
    fetch(`/search/users?query={query}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSearchUserResults(data);
      });
  }, []);

  if (!searchUserResults) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <TextInput icon={<IconSearch />} placeholder="キーワード検索" />
      <Tabs defaultValue="post" mt="md">
        <Tabs.List grow position="center">
          <Tabs.Tab value="post">投稿</Tabs.Tab>
          <Tabs.Tab value="account">アカウント</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="post">
          {searchPostResults?.map((searchPostResult) => {
            return <Post key={searchPostResult.id} post={searchPostResult} />;
          })}
        </Tabs.Panel>
        <Tabs.Panel value="account">
          {searchUserResults.map((searchUserResult) => {
            return (
              <UserItem
                key={searchUserResult.id}
                propsUser={searchUserResult}
              />
            );
          })}
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
