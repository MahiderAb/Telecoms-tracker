/*
  Warnings:

  - Added the required column `assigneeId` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `issue` ADD COLUMN `assigneeId` VARCHAR(191) NOT NULL,
    ADD COLUMN `priority` VARCHAR(191) NOT NULL,
    ADD COLUMN `projectId` VARCHAR(191) NOT NULL;
