import type { Meta, StoryObj } from "@storybook/react";

import { Comment } from "@/features/comments-feature/Comment/Comment";

const meta: Meta<typeof Comment> = {
  component: Comment,
  tags: ["autodocs"],
  title: "Comment",
};

export default meta;
type Story = StoryObj<typeof Comment>;

export const Default: Story = {};
