/*
  Warnings:

  - You are about to drop the column `cityId` on the `Warehouse` table. All the data in the column will be lost.
  - Added the required column `city_id` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_cityId_fkey";

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "cityId",
ADD COLUMN     "city_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
