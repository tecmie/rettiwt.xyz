/*
  Warnings:

  - Added the required column `tone_of_voice` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "tone_of_voice" TEXT NOT NULL;
