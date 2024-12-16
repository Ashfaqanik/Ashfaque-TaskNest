/*
  Warnings:

  - You are about to drop the column `imageId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_imageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_imageId_fkey";

-- DropIndex
DROP INDEX "Task_imageId_key";

-- DropIndex
DROP INDEX "User_imageId_key";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "imageId",
ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageId",
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "TaskImage";
