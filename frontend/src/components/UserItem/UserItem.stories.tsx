import type { Meta, StoryObj } from "@storybook/react";

import { UserItem } from "@/components/UserItem/UserItem";

const meta: Meta<typeof UserItem> = {
  args: {
    propsUser: {
      id: 2,
      bio: "バックエンドエンジニア。TypeScriptとPythonに興味があります。",
      createdAt: new Date(),
      email: "takuro_sato@example.com",
      followerCount: 12,
      followingCount: 31,
      location: "Kyoto, Japan",
      name: "TakuroSato",
      passwordHash: "testpassword",
      profileImageUrl: "/__mocks__/images/img02.png",
      updatedAt: new Date(),
      username: "@takuro_sato",
      website: "https://takuro_sato.com",
    },
  },
  component: UserItem,
  tags: ["autodocs"],
  title: "UserItem",
};

export default meta;
type Story = StoryObj<typeof UserItem>;

export const Default: Story = {};
