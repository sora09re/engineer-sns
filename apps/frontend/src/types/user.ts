export type User = {
  id: string;
  bio?: string;
  created_at: string;
  email: string;
  location?: string;
  name: string;
  profileImageUrl?: string;
  updated_at: string;
  username: string;
  website?: string;
};

export type UserProps = {
  user: User;
};
