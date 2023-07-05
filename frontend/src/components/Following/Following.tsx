import { Tabs } from "@mantine/core";
import { useEffect, useState } from "react";

import { UserItem } from "@/components/UserItem/UserItem";
import type { User } from "@/types/user";

export const Following: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<User[] | null>(null);
  const [followingUsers, setFollowingUsers] = useState<User[] | null>(null);

  useEffect(() => {
    fetch("/api/current")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCurrentUser(data);
      });
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetch("/users/followers")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setFollowers(data);
        });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetch("/users/following")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setFollowingUsers(data);
        });
    }
  }, [currentUser]);

  if (!followers) {
    return <div>Loading...</div>;
  }

  if (!followingUsers) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Tabs defaultValue="followers" mt="md">
        <Tabs.List grow position="center">
          <Tabs.Tab value="followers">フォロワー</Tabs.Tab>
          <Tabs.Tab value="following">フォロー中</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="followers">
          {followers.map((follower) => {
            return (
              <UserItem key={follower.id} propsUser={follower} />
            );
          })}
        </Tabs.Panel>
        <Tabs.Panel value="following">
          {followingUsers.map((followingUser) => {
            return (
              <UserItem key={followingUser.id} propsUser={followingUser} />
            );
          })}
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
