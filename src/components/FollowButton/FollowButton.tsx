import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import useSWR from "swr";

import { useGetProfile } from "@/hooks/useGetProfile";
import { baseURL } from "@/utils/baseUrl";
import { api, fetcher } from "@/utils/api";

interface FollowButtonProps {
	currentUserId: string;
	userId: string;
}

export const FollowButton = ({ currentUserId, userId }: FollowButtonProps) => {
	const [label, setLabel] = useState("フォロー中");
	const endpoint = `${baseURL}/api/users/${userId}/follow`;
	const { mutate: getProfileMutate } = useGetProfile(userId);

	const {
		data,
		error,
		mutate: fetchFollowMutate,
	} = useSWR(`${endpoint}?currentUserId=${currentUserId}`, fetcher);

	if (error) {
		return <div>エラーが発生しました: {error.message}</div>;
	}

	const isFollowing = data?.isFollowing;

	const handleFollow = async () => {
		try {
			await api.post(`${endpoint}?currentUserId=${currentUserId}`);
			fetchFollowMutate();
			getProfileMutate();
		} catch {
			notifications.show({
				id: "follow-error",
				autoClose: 2000,
				color: "red",
				icon: <IconX size="1rem" />,
				message: "フォローに失敗しました。",
				title: "エラー",
			});
		}
	};

	const handleRemoveFollow = async () => {
		try {
			await api.delete(endpoint, { currentUserId });
			fetchFollowMutate();
			getProfileMutate();
		} catch {
			notifications.show({
				id: "unfollow-error",
				autoClose: 2000,
				color: "red",
				icon: <IconX size="1rem" />,
				message: "フォロー解除に失敗しました。",
				title: "エラー",
			});
		}
	};

	return (
		<>
			{isFollowing ? (
				<Button
					onMouseEnter={() => {
						return setLabel("フォロー解除");
					}}
					onMouseLeave={() => {
						return setLabel("フォロー中");
					}}
					variant="outline"
					color="dark"
					styles={(theme) => {
						return {
							root: {
								"&:not([data-disabled])": theme.fn.hover({
									backgroundColor: "white",
									borderColor: "red",
									color: "red",
								}),
							},
						};
					}}
					onClick={(event) => {
						event.stopPropagation();
						return handleRemoveFollow();
					}}
				>
					{label}
				</Button>
			) : (
				<Button
					onClick={(event) => {
						event.stopPropagation();
						return handleFollow();
					}}
				>
					フォロー
				</Button>
			)}
		</>
	);
};
