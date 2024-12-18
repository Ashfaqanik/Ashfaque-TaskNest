/*
  Warnings:

  - You are about to drop the `ProjectTeam` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `teamId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectTeam" DROP CONSTRAINT "ProjectTeam_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTeam" DROP CONSTRAINT "ProjectTeam_teamId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProjectTeam";
