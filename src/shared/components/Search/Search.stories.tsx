import type { Meta, StoryObj } from "@storybook/react";

import { Search } from "@/shared/components/Search/Search";

const meta: Meta<typeof Search> = {
	component: Search,
	tags: ["autodocs"],
	title: "Search",
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {};
