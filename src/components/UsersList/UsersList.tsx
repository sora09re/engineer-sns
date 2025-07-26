import { UserItem } from "@/components/UserItem/UserItem";
import type { User } from "@/shared/types/user";

interface PostsListProps {
	currentUserId: string;
	users: User[];
}

export const UsersList = ({ currentUserId, users }: PostsListProps) => {
	if (!users) {
		return <></>;
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
