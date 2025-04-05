import type { Meta, StoryObj } from "@storybook/react";
import { SessionProvider } from "next-auth/react";
import { AccountButton } from "./AccountButton";

export const mockUser = {
	currentUser: {
		name: "John Doe",
		username: "johndoe",
		profile_image_url: "https://i.pravatar.cc/150?img=3",
	},
};

export const mockHandler = [];

const meta: Meta<typeof AccountButton> = {
	title: "AccountButton",
	component: AccountButton,
	tags: ["autodocs"],
	decorators: [
		(Story: React.ComponentType) => (
			<SessionProvider
				session={{
					user: mockUser.currentUser,
					expires: "2099-12-31T23:59:59.000Z",
				}}
			>
				<Story />
			</SessionProvider>
		),
	],
	args: mockUser,
};
export default meta;

type Story = StoryObj<typeof AccountButton>;

export const Primary: Story = {};
