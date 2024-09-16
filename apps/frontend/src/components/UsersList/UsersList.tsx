import { Flex } from "@mantine/core";

import { UserItem } from "@/components/UserItem/UserItem";
import type { User } from "@/types/user";

interface PostsListProps {
  currentUserId: string;
  keyword?: string;
  users: User[];
}

export const UsersList = ({
  currentUserId,
  keyword,
  users,
}: PostsListProps) => {
  if (!users) {
    return <></>;
  }
  if (keyword && users.length === 0) {
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
