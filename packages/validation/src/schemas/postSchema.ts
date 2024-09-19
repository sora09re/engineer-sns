import { z } from "zod";

export const postIdSchema = z
  .string()
  .uuid({ message: "無効な投稿IDの形式です。" });

export const createPostInputSchema = z.object({
  postContent: z.string().min(1, { message: "投稿内容は必須です。" }),
  currentUserId: z.string().uuid({ message: "無効なユーザーIDの形式です。" }),
});

export const getTimelinePostsInputSchema = z.object({
  currentUserId: z.string().uuid({ message: "無効なユーザーIDの形式です。" }),
});

export const addCommentSchema = z.object({
  commentContent: z.string().min(1, { message: "コメント内容は必須です。" }),
  currentUserId: z.string().uuid({ message: "無効なユーザーIDの形式です。" }),
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type GetTimelinePostsInput = z.infer<typeof getTimelinePostsInputSchema>;
