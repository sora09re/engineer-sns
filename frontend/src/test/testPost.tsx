import { testComment1, testComment2, testComment3 } from "@/test/testComment";
import type { Post } from "@/types/post";

export const testPost1: Post = {
  id: 1,
  comments: [testComment1, testComment2],
  content: "This is my first post",
  createdAt: new Date(2023, 6, 1),
  isDeleted: false,
  likesCount: 20,
  repostsCount: 5,
  updatedAt: new Date(2023, 6, 1),
  userId: 1,
};

export const testPost2: Post = {
  id: 2,
  comments: [testComment3],
  content: "This is another post",
  createdAt: new Date(2023, 6, 2),
  isDeleted: false,
  likesCount: 30,
  repostsCount: 10,
  updatedAt: new Date(2023, 6, 2),
  userId: 2,
};

export const testPost3: Post = {
  id: 3,
  comments: [],
  content: "This is yet another post",
  createdAt: new Date(2023, 6, 3),
  isDeleted: true,
  likesCount: 0,
  repostsCount: 0,
  updatedAt: new Date(2023, 6, 3),
  userId: 3,
};
