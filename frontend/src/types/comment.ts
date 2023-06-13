export type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  isDeleted: boolean;
  likesCount: number;
  postId: number;
  updatedAt: Date;
  userId: number;
};
