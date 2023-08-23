/*
  Warnings:

  - You are about to drop the column `parent_id` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Tweet` table. All the data in the column will be lost.
  - Added the required column `intent` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tweet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "quote_count" INTEGER NOT NULL DEFAULT 0,
    "reply_count" INTEGER NOT NULL DEFAULT 0,
    "repost_count" INTEGER NOT NULL DEFAULT 0,
    "favorite_count" INTEGER NOT NULL DEFAULT 0,
    "bookmark_count" INTEGER NOT NULL DEFAULT 0,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" BIGINT NOT NULL,
    "intent" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_quote_tweet" BOOLEAN NOT NULL,
    "is_reply_tweet" BOOLEAN NOT NULL,
    "reply_parent_id" TEXT,
    "quote_parent_id" TEXT,
    CONSTRAINT "Tweet_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tweet_reply_parent_id_fkey" FOREIGN KEY ("reply_parent_id") REFERENCES "Tweet" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tweet_quote_parent_id_fkey" FOREIGN KEY ("quote_parent_id") REFERENCES "Tweet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tweet" ("author_id", "bookmark_count", "content", "favorite_count", "id", "is_pinned", "is_quote_tweet", "is_reply_tweet", "quote_count", "reply_count", "repost_count", "timestamp") SELECT "author_id", "bookmark_count", "content", "favorite_count", "id", "is_pinned", "is_quote_tweet", "is_reply_tweet", "quote_count", "reply_count", "repost_count", "timestamp" FROM "Tweet";
DROP TABLE "Tweet";
ALTER TABLE "new_Tweet" RENAME TO "Tweet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
