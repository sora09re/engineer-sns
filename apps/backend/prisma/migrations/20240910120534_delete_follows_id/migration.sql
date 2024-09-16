/*
  Warnings:

  - The primary key for the `Follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Follows` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[githubId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `githubId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerId", "followingId");

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "githubId" TEXT NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_githubId_key" ON "Users"("githubId");
