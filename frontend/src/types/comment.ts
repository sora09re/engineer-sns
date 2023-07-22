export type Comment = {
  id: number;
  comments: Comment[];
  content: string;
  created_at: string;
  is_deleted: boolean;
  post_id: number;
  updated_at: string;
  user_id: number;
};

export type CommentProps = {
  comment: Comment;
};
