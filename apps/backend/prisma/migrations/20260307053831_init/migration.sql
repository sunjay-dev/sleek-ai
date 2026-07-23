-- CreateEnum
CREATE TYPE "RagStatus" AS ENUM ('IDLE', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "isRag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ragStatus" "RagStatus" NOT NULL DEFAULT 'IDLE';
