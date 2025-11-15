import type { AppRouter } from "@/shared/lib";
import { Flex, Space, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons";

interface PreviousPageHeaderProps {
	router: AppRouter;
}

export const PreviousPageHeader = ({ router }: PreviousPageHeaderProps) => {
	return (
		<Flex sx={{ borderBottom: "1px solid #E9ECEF" }} p="md">
			<IconArrowLeft
				size="1.5rem"
				cursor="pointer"
				onClick={() => {
					router.back();
				}}
			/>
			<Space w="sm" />
			<Text fw="bold">戻る</Text>
		</Flex>
	);
};
