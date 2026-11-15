import { Box, Center, Loader, Tabs, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { searchPostsQuery, searchUsersQuery } from "@/api/queries";
import { Post } from "@/components/Post/Post";
import { UserItem } from "@/components/UserItem/UserItem";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Search = () => {
	const currentUser = useCurrentUser();
	const [keyword, setKeyword] = useState("");
	const [debouncedKeyword] = useDebouncedValue(keyword.trim(), 300);

	const { data: searchUserResults, isLoading: isLoadingSearchUser } = useQuery({
		...searchUsersQuery(debouncedKeyword),
		placeholderData: keepPreviousData,
	});
	const { data: searchPostResults, isLoading: isLoadingSearchPost } = useQuery({
		...searchPostsQuery(debouncedKeyword),
		placeholderData: keepPreviousData,
	});

	return (
		<Box p="md">
			<TextInput
				leftSection={<IconSearch />}
				placeholder="キーワード検索"
				value={keyword}
				onChange={(e) => {
					return setKeyword(e.target.value);
				}}
			/>
			<Tabs defaultValue="post" mt="md">
				<Tabs.List grow justify="center">
					<Tabs.Tab value="post">投稿</Tabs.Tab>
					<Tabs.Tab value="account">アカウント</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value="post">
					{isLoadingSearchPost ? (
						<Center mt={300}>
							<Loader />
						</Center>
					) : (
						searchPostResults?.map((post) => {
							return <Post key={post.id} post={post} currentUserId={currentUser.id} />;
						})
					)}
				</Tabs.Panel>
				<Tabs.Panel value="account">
					{isLoadingSearchUser ? (
						<Center mt={300}>
							<Loader />
						</Center>
					) : (
						searchUserResults?.map((user) => {
							return <UserItem key={user.id} propsUser={user} currentUserId={currentUser.id} />;
						})
					)}
				</Tabs.Panel>
			</Tabs>
		</Box>
	);
};
