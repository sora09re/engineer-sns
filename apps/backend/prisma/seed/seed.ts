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

  const user3 = await prisma.users.create({
    data: {
      githubId: '192837465',
      bio: 'Frontend developer',
      email: 'user3@example.com',
      location: 'San Francisco',
      name: 'Alice Johnson',
      profileImageUrl: 'https://example.com/profile3.jpg',
      username: 'alicejohnson',
      website: 'https://alicejohnson.dev',
    },
  });

  const user4 = await prisma.users.create({
    data: {
      githubId: '564738291',
      bio: 'DevOps specialist',
      email: 'user4@example.com',
      location: 'Chicago',
      name: 'Bob Lee',
      profileImageUrl: 'https://example.com/profile4.jpg',
      username: 'boblee',
      website: 'https://boblee.dev',
    },
  });

  const user5 = await prisma.users.create({
    data: {
      githubId: '1029384756',
      bio: 'Mobile app developer',
      email: 'user5@example.com',
      location: 'Seattle',
      name: 'Carol King',
      profileImageUrl: 'https://example.com/profile5.jpg',
      username: 'carolking',
      website: 'https://carolking.dev',
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

  const post2 = await prisma.posts.create({
    data: {
      content: 'Excited to join this platform.',
      isDeleted: false,
      userId: user2.id,
    },
  });

  const post3 = await prisma.posts.create({
    data: {
      content: 'Check out my new project!',
      isDeleted: false,
      userId: user3.id,
    },
  });

  const post4 = await prisma.posts.create({
    data: {
      content: 'DevOps best practices.',
      isDeleted: false,
      userId: user4.id,
    },
  });

  const post5 = await prisma.posts.create({
    data: {
      content: 'Launching my mobile app tomorrow.',
      isDeleted: false,
      userId: user5.id,
    },
  });

  // 返信ポスト
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

  await prisma.likes.create({
    data: {
      postId: post2.id,
      userId: user1.id,
    },
  });

  await prisma.likes.create({
    data: {
      postId: post3.id,
      userId: user4.id,
    },
  });

  await prisma.likes.create({
    data: {
      postId: post4.id,
      userId: user5.id,
    },
  });

  await prisma.likes.create({
    data: {
      postId: post5.id,
      userId: user3.id,
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

  await prisma.follows.create({
    data: {
      followerId: user3.id,
      followingId: user1.id,
    },
  });

  await prisma.follows.create({
    data: {
      followerId: user4.id,
      followingId: user2.id,
    },
  });

  await prisma.follows.create({
    data: {
      followerId: user5.id,
      followingId: user3.id,
    },
  });

  console.info('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
