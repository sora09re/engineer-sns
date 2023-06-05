import type { Meta, StoryObj } from "@storybook/react";

import { NewPostForm } from "@/features/posts-feature/NewPostForm/NewPostForm";

const meta: Meta<typeof NewPostForm> = {
  component: NewPostForm,
  tags: ["autodocs"],
  title: "NewPostForm",
};

export default meta;
type Story = StoryObj<typeof NewPostForm>;

export const Default: Story = {};
