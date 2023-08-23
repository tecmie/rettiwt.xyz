/*
  Warnings:

  - You are about to drop the column `authorId` on the `Retweet` table. All the data in the column will be lost.
  - You are about to drop the column `originalState` on the `Retweet` table. All the data in the column will be lost.
  - You are about to drop the column `tweetId` on the `Retweet` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `followerId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `is_retweet` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `originalTweetId` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `originalState` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `tweetId` on the `Like` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `Retweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin_state` to the `Retweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tweet_id` to the `Retweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `follower_id` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `following_id` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_reply_tweet` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin_state` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tweet_id` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Retweet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origin_state" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "tweet_id" TEXT NOT NULL,
    CONSTRAINT "Retweet_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Retweet_tweet_id_fkey" FOREIGN KEY ("tweet_id") REFERENCES "Tweet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Retweet" ("createdAt", "id") SELECT "createdAt", "id" FROM "Retweet";
DROP TABLE "Retweet";
ALTER TABLE "new_Retweet" RENAME TO "Retweet";
CREATE TABLE "new_Follow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Follow" ("id") SELECT "id" FROM "Follow";
DROP TABLE "Follow";
ALTER TABLE "new_Follow" RENAME TO "Follow";
CREATE TABLE "new_Tweet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "quote_count" INTEGER NOT NULL DEFAULT 0,
    "reply_count" INTEGER NOT NULL DEFAULT 0,
    "repost_count" INTEGER NOT NULL DEFAULT 0,
    "favorite_count" INTEGER NOT NULL DEFAULT 0,
    "bookmark_count" INTEGER NOT NULL DEFAULT 0,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_quote_tweet" BOOLEAN NOT NULL,
    "is_reply_tweet" BOOLEAN NOT NULL,
    "parent_id" TEXT,
    CONSTRAINT "Tweet_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tweet_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Tweet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tweet" ("bookmark_count", "content", "favorite_count", "id", "is_pinned", "is_quote_tweet", "quote_count", "reply_count", "repost_count", "timestamp", "type") SELECT "bookmark_count", "content", "favorite_count", "id", "is_pinned", "is_quote_tweet", "quote_count", "reply_count", "repost_count", "timestamp", "type" FROM "Tweet";
DROP TABLE "Tweet";
ALTER TABLE "new_Tweet" RENAME TO "Tweet";
CREATE TABLE "new_Like" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origin_state" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "tweet_id" TEXT NOT NULL,
    CONSTRAINT "Like_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Like_tweet_id_fkey" FOREIGN KEY ("tweet_id") REFERENCES "Tweet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Like" ("createdAt", "id") SELECT "createdAt", "id" FROM "Like";
DROP TABLE "Like";
ALTER TABLE "new_Like" RENAME TO "Like";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
