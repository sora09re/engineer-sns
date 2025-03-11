import type { Meta, StoryObj } from "@storybook/react";

import { ImageUpload } from "@/components/ImageUpload/ImageUpload";

const meta: Meta<typeof ImageUpload> = {
	component: ImageUpload,
	tags: ["autodocs"],
	title: "ImageUpload",
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {};
