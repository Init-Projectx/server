-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "total_weight" INTEGER;

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "total_weight" INTEGER,
ALTER COLUMN "warehouse_id" DROP NOT NULL,
ALTER COLUMN "shipping_cost" DROP NOT NULL,
ALTER COLUMN "total_price" DROP NOT NULL,
ALTER COLUMN "net_price" DROP NOT NULL;
