import { Box, Tabs, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useState } from "react";

import { PostsList } from "@/components/PostsList/PostsList";
import { UsersList } from "@/components/UsersList/UsersList";
import { testPost1, testPost2, testPost3 } from "@/test/testPost";
import { testUser1, testUser2, testUser3 } from "@/test/testUser";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";

const currentUser: User = testUser1;

export const Search = () => {
  const [searchPostResults, _setSearchPostResults] = useState<PostType[]>([
    testPost1,
    testPost2,
    testPost3,
  ]);
  const [searchUserResults, _setSearchUserResults] = useState<User[] | null>([
    testUser1,
    testUser2,
    testUser3,
  ]);

  if (!searchUserResults) {
    return <div>Loading...</div>;
  }

  return (
    <Box p="md">
      <TextInput icon={<IconSearch />} placeholder="キーワード検索" />
      <Tabs defaultValue="post" mt="md">
        <Tabs.List grow position="center">
          <Tabs.Tab value="post">投稿</Tabs.Tab>
          <Tabs.Tab value="account">アカウント</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="post">
          <PostsList currentUser={currentUser} posts={searchPostResults} />
        </Tabs.Panel>
        <Tabs.Panel value="account">
          <UsersList users={searchUserResults} />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
