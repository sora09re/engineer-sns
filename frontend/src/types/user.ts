export type User = {
  id: number;
  bio?: string;
  createdAt: Date;
  email: string;
  followerCount: number;
  followingCount: number;
  location?: string;
  name: string;
  passwordHash: string;
  profileImageUrl?: string;
  updatedAt: Date;
  username: string;
  website?: string;
};

export type UserProps = {
  user: User;
};
