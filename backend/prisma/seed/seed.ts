import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ユーザー作成
  const user1 = await prisma.users.create({
    data: {
      githubId: '123456789',
      bio: 'Full-stack developer',
      email: 'user1@example.com',
      location: 'New York',
      name: 'John Doe',
      profileImageUrl: 'https://example.com/profile1.jpg',
      username: 'johndoe',
      website: 'https://johndoe.dev',
    },
  });

  const user2 = await prisma.users.create({
    data: {
      githubId: '987654321',
      bio: 'Backend engineer',
      email: 'user2@example.com',
      location: 'Los Angeles',
      name: 'Jane Smith',
      profileImageUrl: 'https://example.com/profile2.jpg',
      username: 'janesmith',
      website: 'https://janesmith.dev',
    },
  });

  // ポスト作成
  const post1 = await prisma.posts.create({
    data: {
      content: 'This is my first post!',
      isDeleted: false,
      userId: user1.id,
    },
  });

  await prisma.posts.create({
    data: {
      content: 'This is a reply to the first post.',
      isDeleted: false,
      userId: user2.id,
      parentPostId: post1.id,
    },
  });

  // いいね作成
  await prisma.likes.create({
    data: {
      postId: post1.id,
      userId: user2.id,
    },
  });

  // フォロー作成
  await prisma.follows.create({
    data: {
      followerId: user1.id,
      followingId: user2.id,
    },
  });

  await prisma.follows.create({
    data: {
      followerId: user2.id,
      followingId: user1.id,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
