import { Flex } from "@mantine/core";

import { UserItem } from "@/components/UserItem/UserItem";
import type { User } from "@/types/user";

interface PostsListProps {
  currentUserId: string;
  users: User[];
}

export const UsersList = ({ currentUserId, users }: PostsListProps) => {
  if (!users) {
    return <></>;
  }
  if (users.length === 0) {
    return (
      <Flex h="100%" justify="center" align="center">
        検索結果が見つかりませんでした。
      </Flex>
    );
  }

  return (
    <>
      {users.map((user) => {
        return (
          <UserItem
            key={user.id}
            propsUser={user}
            currentUserId={currentUserId}
          />
        );
      })}
    </>
  );
};
