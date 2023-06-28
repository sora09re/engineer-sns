import type { Meta, StoryObj } from "@storybook/react";

//import rest from "react-syntax-highlighter/dist/esm/languages/prism/rest";
import { Following } from "@/components/Following/Following";

const meta: Meta<typeof Following> = {
  component: Following,
  tags: ["autodocs"],
  title: "Following",
};

export default meta;
type Story = StoryObj<typeof Following>;

export const Default: Story = {};
