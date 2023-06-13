import { atom } from "recoil";

const date1 = new Date("2023-06-01T00:00:00Z");
const date2 = new Date("2023-06-02T00:00:00Z");
const date3 = new Date("2023-06-03T00:00:00Z");

export const postsState = atom({
  default: [
    {
      id: 1,
      comments: [
        {
          id: 1,
          content: "This is the first comment",
          createdAt: date1,
          isDeleted: false,
          likesCount: 5,
          postId: 1,
          updatedAt: date1,
          userId: 2,
        },
        {
          id: 2,
          content: "This is the second comment",
          createdAt: date1,
          isDeleted: false,
          likesCount: 3,
          postId: 1,
          updatedAt: date1,
          userId: 3,
        },
      ],
      content: "This is the first post",
      createdAt: date1,
      isDeleted: false,
      likesCount: 10,
      repostsCount: 2,
      updatedAt: date1,
      userId: 1,
    },
    {
      id: 2,
      comments: [
        {
          id: 3,
          content: "This is the third comment",
          createdAt: date2,
          isDeleted: false,
          likesCount: 2,
          postId: 2,
          updatedAt: date2,
          userId: 4,
        },
      ],
      content: "This is the second post",
      createdAt: date2,
      isDeleted: false,
      likesCount: 8,
      repostsCount: 1,
      updatedAt: date2,
      userId: 2,
    },
    {
      id: 3,
      comments: [
        {
          id: 4,
          content: "This is the fourth comment",
          createdAt: date3,
          isDeleted: false,
          likesCount: 1,
          postId: 3,
          updatedAt: date3,
          userId: 5,
        },
      ],
      content: "This is the third post",
      createdAt: date3,
      isDeleted: false,
      likesCount: 5,
      repostsCount: 0,
      updatedAt: date3,
      userId: 3,
    },
  ],
  key: "postsState",
});
