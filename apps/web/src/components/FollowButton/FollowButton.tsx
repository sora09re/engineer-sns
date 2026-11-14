import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { isFollowingQuery } from "@/api/queries";
import { useToggleFollow } from "@/hooks/mutations";

import classes from "./FollowButton.module.css";

interface FollowButtonProps {
	userId: string;
}

export const FollowButton = ({ userId }: FollowButtonProps) => {
	const [label, setLabel] = useState("フォロー中");
	const { data: isFollowing, error } = useQuery(isFollowingQuery(userId));
	const toggleFollow = useToggleFollow();

	if (error) {
		return <div>エラーが発生しました: {error.message}</div>;
	}

	const handleToggle = (follow: boolean) => {
		toggleFollow.mutate(
			{ follow, userId },
			{
				onError: () => {
					notifications.show({
						id: follow ? "follow-error" : "unfollow-error",
						autoClose: 2000,
						color: "red",
						icon: <IconX size="1rem" />,
						message: follow ? "フォローに失敗しました。" : "フォロー解除に失敗しました。",
						title: "エラー",
					});
				},
			},
		);
	};

	if (isFollowing) {
		return (
			<Button
				onMouseEnter={() => {
					return setLabel("フォロー解除");
				}}
				onMouseLeave={() => {
					return setLabel("フォロー中");
				}}
				variant="outline"
				color="dark"
				loading={toggleFollow.isPending}
				className={classes.unfollow}
				onClick={(event) => {
					event.stopPropagation();
					handleToggle(false);
				}}
			>
				{label}
			</Button>
		);
	}

	return (
		<Button
			loading={toggleFollow.isPending || isFollowing === undefined}
			onClick={(event) => {
				event.stopPropagation();
				handleToggle(true);
			}}
		>
			フォロー
		</Button>
	);
};
