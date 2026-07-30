/*
  Warnings:

  - You are about to drop the column `isRag` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `ragStatus` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "isRag",
DROP COLUMN "ragStatus";

-- DropEnum
DROP TYPE "RagStatus";
