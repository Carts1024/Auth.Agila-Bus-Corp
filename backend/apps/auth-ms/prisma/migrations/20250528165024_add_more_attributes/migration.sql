/*
  Warnings:

  - Added the required column `birthdate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "barangay" TEXT,
ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "securityAnswerHash" TEXT,
ADD COLUMN     "securityQuestion" TEXT,
ADD COLUMN     "streetAddress" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "zipCode" TEXT,
ALTER COLUMN "email" SET NOT NULL;
