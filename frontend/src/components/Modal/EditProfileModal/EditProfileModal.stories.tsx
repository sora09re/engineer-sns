import type { Meta, StoryObj } from "@storybook/react";

import { EditProfileModal } from "@/components/Modal/EditProfileModal/EditProfileModal";

const meta: Meta<typeof EditProfileModal> = {
  component: EditProfileModal,
  tags: ["autodocs"],
  title: "EditProfileModal",
};

export default meta;
type Story = StoryObj<typeof EditProfileModal>;

export const Default: Story = {};
