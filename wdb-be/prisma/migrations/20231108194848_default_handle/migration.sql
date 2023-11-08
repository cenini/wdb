/*
  Warnings:

  - Added the required column `passhash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passhash" TEXT NOT NULL,
ADD COLUMN     "salt" VARCHAR(32) NOT NULL;
