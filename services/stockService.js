const prisma = require("../lib/prisma");

const addStock = async (productId, warehouseId, quantity) => {
  try {
    // Check if stock already exists for this product and warehouse
    const existingStock = await prisma.product_Warehouse.findUnique({
      where: {
        product_id_warehouse_id: {
          product_id: productId,
          warehouse_id: warehouseId,
        },
      },
    });

    if (existingStock) {
      // Update existing stock
      return await prisma.product_Warehouse.update({
        where: {
          id: existingStock.id,
        },
        data: {
          stock: existingStock.stock + quantity,
          updated_at: new Date(),
        },
      });
    } else {
      // Create new stock record
      return await prisma.product_Warehouse.create({
        data: {
          product_id: productId,
          warehouse_id: warehouseId,
          stock: quantity,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }
  } catch (error) {
    throw new Error(`Error adding stock: ${error.message}`);
  }
};

const getStock = async (productId, warehouseId) => {
    try {
        return await prisma.product_Warehouse.findUnique({
          where: {
            product_id_warehouse_id: {
              product_id: productId,
              warehouse_id: warehouseId
            }
          }
        });
      } catch (error) {
        throw new Error(`Error fetching stock: ${error.message}`);
      }
};

module.exports = { addStock, getStock };
