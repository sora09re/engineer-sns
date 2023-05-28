import type { Meta, StoryObj } from "@storybook/react";

import type { PostProps } from "@/components/Post/Post";
import { Post } from "@/components/Post/Post"; // PostPropsをインポート

const meta: Meta<typeof Post> = {
  component: Post,
  tags: ["autodocs"],
  title: "Post",
};

export default meta;

type Story = StoryObj<typeof Post>;

export const Default: Story = (args: PostProps) => {
  return <Post {...args} />;
};

Default.args = {
  post: { id: 1, content: "Sample content" },
};

export const Code: Story = (args: PostProps) => {
  return <Post {...args} />;
};

Code.args = {
  post: { id: 1, content: "```<p>これはpタグです。</p>```" },
};
