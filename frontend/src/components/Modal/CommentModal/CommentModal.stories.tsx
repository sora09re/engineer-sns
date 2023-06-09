import type { Meta, StoryObj } from "@storybook/react";

import { CommentModal } from "@/components/Modal/CommentModal/CommentModal";

const meta: Meta<typeof CommentModal> = {
  component: CommentModal,
  tags: ["autodocs"],
  title: "CommentModal",
};

export default meta;
type Story = StoryObj<typeof CommentModal>;

export const Default: Story = {};
