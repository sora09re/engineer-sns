import { Container } from "@mantine/core";
import { useEffect, useState } from "react";

import { FollowingItem } from "@/components/FollowingItem/FollowingItem";
import type { User } from "@/types/user";

export const Following: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
      fetch(`/users/following`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setFollowingUsers(data);
        });
    }
  }, [currentUser]);

  if (!followingUsers) {
    return <div>Loading...</div>;
  }

  return (
    <Container p={50}>
      {followingUsers.map((followingUser) => {
        return <FollowingItem key={followingUser.id} followingUser={followingUser} />;
      })}
    </Container>
  );
};
