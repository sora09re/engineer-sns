import type { Meta, StoryObj } from "@storybook/react";

import { SignupModal } from "@/components/Modal/SignupModal/SignupModal";

const meta: Meta<typeof SignupModal> = {
  args: {
    opened: false,
  },
  component: SignupModal,
  tags: ["autodocs"],
  title: "Modal/SignupModal",
};

export default meta;
type Story = StoryObj<typeof SignupModal>;

export const Default: Story = {};
