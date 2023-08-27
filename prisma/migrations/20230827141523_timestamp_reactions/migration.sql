/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Retweet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Like" DROP COLUMN "createdAt",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "origin_state" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Retweet" DROP COLUMN "createdAt",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tweet" ALTER COLUMN "is_quote_tweet" SET DEFAULT false,
ALTER COLUMN "is_reply_tweet" SET DEFAULT false;
