/*
  Warnings:

  - Added the required column `image` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;
