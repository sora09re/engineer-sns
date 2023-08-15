import type { Meta, StoryObj } from "@storybook/react";

import { ContentPart } from "@/components/ContentPart/ContentPart";

const meta: Meta<typeof ContentPart> = {
  component: ContentPart,
  tags: ["autodocs"],
  title: "ContentPart",
};

export default meta;
type Story = StoryObj<typeof ContentPart>;

export const Default: Story = {};
