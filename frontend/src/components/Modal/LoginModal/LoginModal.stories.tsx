import type { Meta, StoryObj } from "@storybook/react";

import { LoginModal } from "@/components/Modal/LoginModal/LoginModal";

const meta: Meta<typeof LoginModal> = {
  component: LoginModal,
  tags: ["autodocs"],
  title: "Modal/LoginModal",
};

export default meta;
type Story = StoryObj<typeof LoginModal>;

export const Default: Story = {};
