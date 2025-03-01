import type { Meta, StoryObj } from "@storybook/react";

import { UserItem } from "@/components/UserItem/UserItem";

const meta: Meta<typeof UserItem> = {
  component: UserItem,
  tags: ["autodocs"],
  title: "UserItem",
};

export default meta;
type Story = StoryObj<typeof UserItem>;

export const Default: Story = {};
