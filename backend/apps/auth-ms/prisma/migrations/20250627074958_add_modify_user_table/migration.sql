-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_securityQuestionId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "securityAnswer" DROP NOT NULL,
ALTER COLUMN "securityQuestionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_securityQuestionId_fkey" FOREIGN KEY ("securityQuestionId") REFERENCES "SecurityQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
