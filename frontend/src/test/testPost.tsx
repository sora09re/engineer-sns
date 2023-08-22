export const testPost1 = {
  id: "a1b2c3d4-e5f6-7890-g1h2-3456ijklmnop",
  comments: [],
  content: "This is the first post content.",
  created_at: new Date("2023-08-14T10:00:00Z"),
  is_deleted: false,
  likes: [],
  parent_post_id: null,
  updated_at: new Date("2023-08-14T10:00:00Z"),
  user_id: "u1v2w3x4-y5z6-7890-a1b2-3456cdefghij",
  users: {
    id: "z1x2c3v4-b5n6-m7l8-k9j0-i8u7y6t5r4e3",
    bio: "This is user 3's bio.",
    created_at: new Date().toISOString(),
    email: "user3@example.com",
    location: "Kyoto, Japan",
    name: "User Three",
    profile_image_url: "https://example.com/user3.jpg",
    updated_at: new Date().toISOString(),
    username: "user_three",
    website: "https://user3-website.com",
  },
};

export const testPost2 = {
  id: "p2q3r4s5-t6u7-8901-v2w3-4567mnopqrst",
  comments: [],
  content: "This is the second post content.",
  created_at: new Date("2023-08-15T11:00:00Z"),
  is_deleted: false,
  likes: [],
  parent_post_id: "a1b2c3d4-e5f6-7890-g1h2-3456ijklmnop",
  updated_at: new Date("2023-08-15T11:00:00Z"),
  user_id: "k2l3m4n5-o6p7-8901-q2r3-4567stuvwxyz",
  users: {
    id: "z1x2c3v4-b5n6-m7l8-k9j0-i8u7y6t5r4e3",
    bio: "This is user 3's bio.",
    created_at: new Date().toISOString(),
    email: "user3@example.com",
    location: "Kyoto, Japan",
    name: "User Three",
    profile_image_url: "https://example.com/user3.jpg",
    updated_at: new Date().toISOString(),
    username: "user_three",
    website: "https://user3-website.com",
  },
};

export const testPost3 = {
  id: "z3a4b5c6-d7e8-9012-f3g4-5678hijklmno",
  comments: [],
  content: "This is the third post content.",
  created_at: new Date("2023-08-16T12:00:00Z"),
  is_deleted: false,
  likes: [],
  parent_post_id: null,
  updated_at: new Date("2023-08-16T12:00:00Z"),
  user_id: "z1x2c3v4-b5n6-7890-m1o2-3456pqrs7890",
  users: {
    id: "z1x2c3v4-b5n6-m7l8-k9j0-i8u7y6t5r4e3",
    bio: "This is user 3's bio.",
    created_at: new Date().toISOString(),
    email: "user3@example.com",
    location: "Kyoto, Japan",
    name: "User Three",
    profile_image_url: "https://example.com/user3.jpg",
    updated_at: new Date().toISOString(),
    username: "user_three",
    website: "https://user3-website.com",
  },
};
