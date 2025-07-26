import type { User } from "@/shared/entities";
import { UserItem } from "@/shared/ui/UserItem/UserItem";

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
