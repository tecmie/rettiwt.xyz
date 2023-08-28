/*
  Warnings:

  - Added the required column `persona` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tone_of_voice` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "persona" TEXT NOT NULL,
ADD COLUMN     "tone_of_voice" TEXT NOT NULL;
