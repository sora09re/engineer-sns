import { UserItem } from "@/components/UserItem/UserItem";
import type { User } from "@/types/user";

interface PostsListProps {
  // currentUser: User;
  // mutate?: KeyedMutator<PostType> | KeyedMutator<PostType[]>;
  users: User[];
}

export const UsersList = ({ users }: PostsListProps) => {
  return (
    <>
      {users.map((user) => {
        return <UserItem key={user.id} propsUser={user} />;
      })}
    </>
  );
};
