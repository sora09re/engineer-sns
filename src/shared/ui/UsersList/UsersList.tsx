import { UserItem } from "@/shared/components/UserItem/UserItem";
import type { User } from "@/shared/entities";

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
