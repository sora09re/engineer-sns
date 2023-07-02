import type { User } from "@/types/user";

export const testUser1: User = {
  id: 1,
  bio: "フロントエンドエンジニア。TypeScriptとNextに興味があります。",
  createdAt: new Date(),
  email: "takuro_sato@example.com",
  followerCount: 3421,
  followingCount: 3143,
  location: "Tokyo, Japan",
  name: "TaroYamada",
  passwordHash: "testPassword",
  profileImageUrl: "/__mocks__/images/img01.png",
  updatedAt: new Date(),
  username: "@taro_yamada",
  website: "https://taro_yamada.com",
};

export const testUser2: User = {
  id: 2,
  bio: "バックエンドエンジニア。TypeScriptとPythonに興味があります。",
  createdAt: new Date(),
  email: "takuro_sato@example.com",
  followerCount: 12,
  followingCount: 31,
  location: "Kyoto, Japan",
  name: "TakuroSato",
  passwordHash: "testPassword",
  profileImageUrl: "/__mocks__/images/img02.png",
  updatedAt: new Date(),
  username: "@takuro_sato",
  website: "https://takuro_sato.com",
};

export const testUser3: User = {
  id: 3,
  bio: "インフラエンジニア。Dockerに興味があります。",
  createdAt: new Date(),
  email: "takuro_sato@example.com",
  followerCount: 12,
  followingCount: 31,
  location: "Kanagawa, Japan",
  name: "TakumiEhara",
  passwordHash: "testPassword",
  profileImageUrl: "/__mocks__/images/img02.png",
  updatedAt: new Date(),
  username: "@takumi_ehara",
  website: "https://takumi_ehara.com",
};
