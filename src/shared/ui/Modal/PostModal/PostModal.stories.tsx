import type { Meta, StoryObj } from "@storybook/react";

import { PostModal } from "@/shared/components/Modal/PostModal/PostModal";

const meta: Meta<typeof PostModal> = {
	component: PostModal,
	tags: ["autodocs"],
	title: "Modal/PostModal",
};

export default meta;
type Story = StoryObj<typeof PostModal>;

export const Default: Story = {};
