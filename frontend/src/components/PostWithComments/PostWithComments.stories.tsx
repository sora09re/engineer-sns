import type { Meta, StoryObj } from "@storybook/react";

import { PostWithComments } from "@/components/PostWithComments/PostWithComments";

const meta: Meta<typeof PostWithComments> = {
  component: PostWithComments,
  tags: ["autodocs"],
  title: "PostWithComments",
};

export default meta;
type Story = StoryObj<typeof PostWithComments>;

export const Default: Story = {};
