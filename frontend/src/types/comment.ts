export type Comment = {
  id: number;
  comments: Comment[];
  content: string;
  createdAt: Date;
  isDeleted: boolean;
  likesCount: number;
  postId: number;
  updatedAt: Date;
  userId: number;
};

export type CommentProps = {
  comment: Comment;
};
