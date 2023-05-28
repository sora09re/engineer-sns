import type { Meta, StoryObj } from "@storybook/react";

import { Main } from "./Main";

const meta: Meta<typeof Main> = {
  component: Main,
  tags: ["autodocs"],
  title: "Main",
};

export default meta;
type Story = StoryObj<typeof Main>;

export const Default: Story = {};
