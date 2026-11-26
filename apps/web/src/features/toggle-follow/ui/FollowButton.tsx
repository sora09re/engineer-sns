import { Button } from "@mantine/core";
import { useState } from "react";

import type { UserView } from "@engineer-sns/shared";

import { notifyMutation } from "@/shared/lib";

import { useToggleFollow } from "../api/useToggleFollow";

import classes from "./FollowButton.module.css";

interface FollowButtonProps {
	user: Pick<UserView, "id" | "is_following" | "can_follow">;
}

export const FollowButton = ({ user }: FollowButtonProps) => {
	const [label, setLabel] = useState("フォロー中");
	const toggleFollow = useToggleFollow();

	if (!user.can_follow) {
		return null;
	}

	const handleToggle = (follow: boolean) => {
		const label = follow ? "フォロー" : "フォロー解除";
		void notifyMutation(toggleFollow, { follow, userId: user.id }, { label, report: "failure" });
	};

	if (user.is_following) {
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
			loading={toggleFollow.isPending}
			onClick={(event) => {
				event.stopPropagation();
				handleToggle(true);
			}}
		>
			フォロー
		</Button>
	);
};
