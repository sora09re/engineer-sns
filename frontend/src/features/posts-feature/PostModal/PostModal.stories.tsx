import type { Meta, StoryObj } from "@storybook/react";

import { PostModal } from "@/features/posts-feature/PostModal/PostModal";

const meta: Meta<typeof PostModal> = {
  component: PostModal,
  tags: ["autodocs"],
  title: "PostModal",
};

export default meta;
type Story = StoryObj<typeof PostModal>;

export const Default: Story = {};
