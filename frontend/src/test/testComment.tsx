import type { Comment } from "@/types/comment";

export const testComment1: Comment = {
  id: 1,
  comments: [
    {
      id: 4,
      comments: [],
      content: "I agree with this point!",
      createdAt: new Date(2023, 6, 2, 10, 15),
      isDeleted: false,
      likesCount: 5,
      postId: 1,
      repostsCount: 1,
      updatedAt: new Date(2023, 6, 2, 10, 15),
      userId: 3,
    },
  ],
  content: "This is a great post!",
  createdAt: new Date(2023, 6, 2, 9, 45),
  isDeleted: false,
  likesCount: 20,
  postId: 1,
  repostsCount: 5,
  updatedAt: new Date(2023, 6, 2, 9, 45),
  userId: 2,
};

export const testComment2: Comment = {
  id: 2,
  comments: [],
  content: "Interesting perspective!",
  createdAt: new Date(2023, 6, 2, 10, 30),
  isDeleted: false,
  likesCount: 15,
  postId: 1,
  repostsCount: 3,
  updatedAt: new Date(2023, 6, 2, 10, 30),
  userId: 1,
};

export const testComment3: Comment = {
  id: 3,
  comments: [
    {
      id: 5,
      comments: [],
      content: "Good point!",
      createdAt: new Date(2023, 6, 3, 11, 0),
      isDeleted: false,
      likesCount: 8,
      postId: 2,
      repostsCount: 2,
      updatedAt: new Date(2023, 6, 3, 11, 0),
      userId: 2,
    },
  ],
  content: "I think this is a great idea.",
  createdAt: new Date(2023, 6, 3, 10, 45),
  isDeleted: false,
  likesCount: 25,
  postId: 2,
  repostsCount: 7,
  updatedAt: new Date(2023, 6, 3, 10, 45),
  userId: 1,
};
