import { Flex, Space, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";

export const PreviousPageHeader = () => {
	const router = useRouter();

	return (
		<Flex style={{ borderBottom: "1px solid #E9ECEF" }} p="md">
			<IconArrowLeft
				size="1.5rem"
				cursor="pointer"
				onClick={() => {
					router.history.back();
				}}
			/>
			<Space w="sm" />
			<Text fw="bold">戻る</Text>
		</Flex>
	);
};
