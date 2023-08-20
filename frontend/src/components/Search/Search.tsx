import { Box, Tabs, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { useState } from "react";
import useSWR from "swr";

import { Post } from "@/components/Post/Post";
import { UserItem } from "@/components/UserItem/UserItem";
import type { PostType } from "@/types/post";
import type { User } from "@/types/user";
import { baseURL } from "@/utils/baseUrl";

const currentUser: User = {
  id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  bio: "This is user 1's bio.",
  created_at: new Date().toISOString(),
  email: "user1@example.com",
  location: "Tokyo, Japan",
  name: "User One",
  profile_image_url: "https://example.com/user1.jpg",
  updated_at: new Date().toISOString(),
  username: "user_one",
  website: "https://user1-website.com",
};

export const Search = () => {
  const { data, mutate } = useSWR(`${baseURL}/api/current`);
  console.log(data);

  const [searchPostResults, _setSearchPostResults] = useState<PostType[] | null>(
    [
      {
        id: "a1b2c3d4-e5f6-7890-g1h2-3456ijklmnop",
        comments: [],
        content: "This is the first post content.",
        created_at: new Date("2023-08-14T10:00:00Z"),
        is_deleted: false,
        likes: [],
        parent_post_id: null,
        updated_at: new Date("2023-08-14T10:00:00Z"),
        user_id: "u1v2w3x4-y5z6-7890-a1b2-3456cdefghij",
        users: {
          id: "z1x2c3v4-b5n6-m7l8-k9j0-i8u7y6t5r4e3",
          bio: "This is user 3's bio.",
          created_at: new Date().toISOString(),
          email: "user3@example.com",
          location: "Kyoto, Japan",
          name: "User Three",
          profile_image_url: "https://example.com/user3.jpg",
          updated_at: new Date().toISOString(),
          username: "user_three",
          website: "https://user3-website.com",
        },
      },
      {
        id: "p2q3r4s5-t6u7-8901-v2w3-4567mnopqrst",
        comments: [],
        content: "This is the second post content.",
        created_at: new Date("2023-08-15T11:00:00Z"),
        is_deleted: false,
        likes: [],
        parent_post_id: "a1b2c3d4-e5f6-7890-g1h2-3456ijklmnop",
        updated_at: new Date("2023-08-15T11:00:00Z"),
        user_id: "k2l3m4n5-o6p7-8901-q2r3-4567stuvwxyz",
        users: {
          id: "z1x2c3v4-b5n6-m7l8-k9j0-i8u7y6t5r4e3",
          bio: "This is user 3's bio.",
          created_at: new Date().toISOString(),
          email: "user3@example.com",
          location: "Kyoto, Japan",
          name: "User Three",
          profile_image_url: "https://example.com/user3.jpg",
          updated_at: new Date().toISOString(),
          username: "user_three",
          website: "https://user3-website.com",
        },
      },
      {
        id: "z3a4b5c6-d7e8-9012-f3g4-5678hijklmno",
        comments: [],
        content: "This is the third post content.",
        created_at: new Date("2023-08-16T12:00:00Z"),
        is_deleted: false,
        likes: [],
        parent_post_id: null,
        updated_at: new Date("2023-08-16T12:00:00Z"),
        user_id: "z1x2c3v4-b5n6-7890-m1o2-3456pqrs7890",
        users: {
          id: "z1x2c3v4-b5n6-m7l8-k9j0-i8u7y6t5r4e3",
          bio: "This is user 3's bio.",
          created_at: new Date().toISOString(),
          email: "user3@example.com",
          location: "Kyoto, Japan",
          name: "User Three",
          profile_image_url: "https://example.com/user3.jpg",
          updated_at: new Date().toISOString(),
          username: "user_three",
          website: "https://user3-website.com",
        },
      },
    ]
  );
  const [searchUserResults, _setSearchUserResults] = useState<User[] | null>([
    {
      id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      bio: "This is user 1's bio.",
      created_at: new Date().toISOString(),
      email: "user1@example.com",
      location: "Tokyo, Japan",
      name: "User One",
      profile_image_url: "https://example.com/user1.jpg",
      updated_at: new Date().toISOString(),
      username: "user_one",
      website: "https://user1-website.com",
    },
    {
      id: "p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1",
      bio: "This is user 2's bio.",
      created_at: new Date().toISOString(),
      email: "user2@example.com",
      location: "Osaka, Japan",
      name: "User Two",
      profile_image_url: "https://example.com/user2.jpg",
      updated_at: new Date().toISOString(),
      username: "user_two",
      website: "https://user2-website.com",
    },
    {
      id: "z1x2c3v4-b5n6-m7l8-k9j0-i8u7y6t5r4e3",
      bio: "This is user 3's bio.",
      created_at: new Date().toISOString(),
      email: "user3@example.com",
      location: "Kyoto, Japan",
      name: "User Three",
      profile_image_url: "https://example.com/user3.jpg",
      updated_at: new Date().toISOString(),
      username: "user_three",
      website: "https://user3-website.com",
    },
  ]);

  // useEffect(() => {
  //   fetch(`/search/posts?query={query}`)
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setSearchPostResults(data);
  //     });
  // }, []);

  // useEffect(() => {
  //   fetch(`/search/users?query={query}`)
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setSearchUserResults(data);
  //     });
  // }, []);

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
          {searchPostResults?.map((searchPostResult) => {
            return (
              <Post
                key={searchPostResult.id}
                post={searchPostResult}
                currentUser={currentUser}
                mutate={mutate}
              />
            );
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
