/*
  Warnings:

  - You are about to drop the column `zipCode` on the `Warehouse` table. All the data in the column will be lost.
  - Added the required column `zip_code` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "zipCode",
ADD COLUMN     "zip_code" INTEGER NOT NULL;
