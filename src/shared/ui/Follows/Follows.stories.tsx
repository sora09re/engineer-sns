import type { Meta, StoryObj } from "@storybook/react";

import { Follows } from "@/shared/ui/Follows/Follows";

//import rest from "react-syntax-highlighter/dist/esm/languages/prism/rest";

const meta: Meta<typeof Follows> = {
	component: Follows,
	tags: ["autodocs"],
	title: "Follows",
};

export default meta;
type Story = StoryObj<typeof Follows>;

export const Default: Story = {};
