/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "warehouse_id" DROP NOT NULL,
ALTER COLUMN "shipping_cost" DROP NOT NULL,
ALTER COLUMN "total_price" DROP NOT NULL,
ALTER COLUMN "net_price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_id_key" ON "Cart"("user_id");
