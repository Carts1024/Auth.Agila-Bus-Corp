/*
  Warnings:

  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "departmentID" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- DropTable
DROP TABLE "AuditLog";
