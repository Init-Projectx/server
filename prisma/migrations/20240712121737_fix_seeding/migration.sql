/*
  Warnings:

  - You are about to drop the column `city_id` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `Warehouse` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_city_id_fkey";

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "city_id",
DROP COLUMN "zip_code",
ADD COLUMN     "cityId" INTEGER NOT NULL,
ADD COLUMN     "zipCode" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
