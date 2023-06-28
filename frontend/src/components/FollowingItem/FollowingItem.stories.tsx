import type { Meta, StoryObj } from "@storybook/react";

import { FollowingItem } from "@/components/FollowingItem/FollowingItem";

const meta: Meta<typeof FollowingItem> = {
  args: {
    followingUser: {
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
  component: FollowingItem,
  tags: ["autodocs"],
  title: "FollowingItem",
};

export default meta;
type Story = StoryObj<typeof FollowingItem>;

export const Default: Story = {};
