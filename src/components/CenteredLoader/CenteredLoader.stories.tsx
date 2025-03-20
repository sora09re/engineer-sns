import type { Meta, StoryObj } from "@storybook/react";
import { CenteredLoader } from "./CenteredLoader";

const meta: Meta<typeof CenteredLoader> = {
	title: "CenteredLoader",
	component: CenteredLoader,
	tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof CenteredLoader>;

export const Primary: Story = {};
