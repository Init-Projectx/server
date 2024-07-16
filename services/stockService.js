const prisma = require("../lib/prisma");


const addStock = async (productId, warehouseId, quantity) => {
  // Check if the product exists
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw { name: 'notFound', message: 'product not found' };
  }

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
      },
    });
  } else {
    // Create new stock entry
    return await prisma.product_Warehouse.create({
      data: {
        product_id: productId,
        warehouse_id: warehouseId,
        stock: quantity,
      },
    });
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
