/*
  Warnings:

  - Made the column `securityAnswer` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `securityQuestionId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_securityQuestionId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "securityAnswer" SET NOT NULL,
ALTER COLUMN "securityQuestionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_securityQuestionId_fkey" FOREIGN KEY ("securityQuestionId") REFERENCES "SecurityQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
