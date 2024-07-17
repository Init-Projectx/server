const prisma = require("../lib/prisma");

const addStock = async (params) => {
    const existingProduct = await prisma.product_Warehouse.findFirst({
        where: {
            AND: [
                { product_id: params.product_id },
                { warehouse_id: params.warehouse_id }
            ]
        }
    });

    if (existingProduct) throw { name: 'exist', message: 'Product already exist, you can update product stock' }

    const data = await prisma.product_Warehouse.create({
        data: {
            product_id: params.product_id,
            warehouse_id: params.warehouse_id,
            stock: params.stock
        }
    });

    return data;
};

const updateStock = async (params) => {
    const product = {
        product_id: params.product_id,
        warehouse_id: params.warehouse_id
    };

    const existingProduct = await getStock(params);

    if (!existingProduct) throw { name: 'notFound', message: 'Product Not Found in Warehouse' }

    const data = await prisma.product_Warehouse.update({
        where: {
            id: existingProduct.id
        }, data: {
            stock: params.stock
        }
    });

    if (!data) throw { name: 'notFound', message: 'Product Not Found in the specified Warehouse' }

    return data;
};


const getStock = async (params) => {
    const data = await prisma.product_Warehouse.findFirst({
        where: {
            AND: [
                { warehouse_id: +params.warehouse_id },
                { product_id: params.product_id }
            ]
        }
    });

    if (!data) throw { name: 'notFound', message: 'Error not found' };

    return data;
};

module.exports = { addStock, getStock, updateStock };
