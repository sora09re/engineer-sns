import { Center, Loader } from "@mantine/core";

export const CenteredLoader = () => {
	return (
		<Center style={{ height: "100vh" }}>
			<Loader />
		</Center>
	);
};
