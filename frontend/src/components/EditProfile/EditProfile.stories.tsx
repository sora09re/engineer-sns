import type { Meta, StoryObj } from "@storybook/react";

import { EditProfile } from "@/components/EditProfile/EditProfile";

const meta: Meta<typeof EditProfile> = {
  component: EditProfile,
  tags: ["autodocs"],
  title: "EditProfile",
};

export default meta;
type Story = StoryObj<typeof EditProfile>;

export const Default: Story = {};
