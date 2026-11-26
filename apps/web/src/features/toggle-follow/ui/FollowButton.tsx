import { Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { notifyMutation } from "@/shared/lib";

import { isFollowingQuery } from "../api/isFollowingQuery";
import { useToggleFollow } from "../api/useToggleFollow";

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
		const label = follow ? "フォロー" : "フォロー解除";
		void notifyMutation(toggleFollow, { follow, userId }, { label, report: "failure" });
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
