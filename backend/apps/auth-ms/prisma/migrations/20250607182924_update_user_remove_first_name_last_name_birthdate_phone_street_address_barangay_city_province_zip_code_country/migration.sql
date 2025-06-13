/*
  Warnings:

  - You are about to drop the column `barangay` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `birthdate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `streetAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "barangay",
DROP COLUMN "birthdate",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
DROP COLUMN "province",
DROP COLUMN "streetAddress",
DROP COLUMN "zipCode";
