export type Comment = {
  id: number;
  comments: Comment[];
  content: string;
  createdAt: Date;
  isDeleted: boolean;
  likesCount: number;
  postId: number;
  repostsCount: number;
  updatedAt: Date;
  userId: number;
};

export type CommentProps = {
  comment: Comment;
};
