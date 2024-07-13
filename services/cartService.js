const prisma = require('../lib/prisma');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const findOne = async (params) => {

    const cart = await prisma.cart.findFirst({
        where: params,
        include: { cart_items: true }
    });

    return cart;
};

const update = async (params) => {
        const updatedCart = await prisma.$transaction(async (prisma) => {
            const findOneParams = {
                id: +params.id,
                user_id: +params.user_id
            };
            // dapetin cart
            const cart = await prisma.cart.findUnique({
                where: findOneParams,
                include: {
                    cart_items: true
                }
            });

            if (!cart) {
                throw { name: 'notFound', message: 'Cart to Update Not Found' };
            }

            // ini product
            const product = await prisma.product.findFirst({
                where: {
                    id: +params.product_id
                },
                include: {
                    Product_Warehouses: {
                        include: {
                            warehouse: {
                                include: {
                                    city: true
                                }
                            }
                        }
                    }
                }
            });

            console.log('<<<<<<<<<<<<<<<', product);

            if (!product) {
                throw { name: 'notFound', message: 'Product Not Found' };
            }

            // stock product
            const stockProduct = product.Product_Warehouses[0].stock;

            console.log('<<<<<<<<<<<<<<<<<<', stockProduct);

            if (stockProduct === 0) {
                throw { name: 'notFound', message: 'Out of Stock' };
            }

            // Cek apakah product sudah ada di cart atau belum
            const existingCartItem = await prisma.cart_items.findFirst({
                where: {
                    cart_id: cart.id,
                    product_id: product.id
                }
            });

            if (existingCartItem) {

                console.log('<<<<<<<<<<<', product.id);

                const updateCartItems = await prisma.cart_items.update({
                    where: {
                        product_id: product.id
                    }, data: {
                        quantity: params.quantity
                    }
                });
            }

            // hitung total harga product
            let price = product.price * params.quantity;

            // Buat cart_item baru jika product belum ada di cart
            const newCartItem = await prisma.cart_items.create({
                data: {
                    cart_id: cart.id,
                    product_id: product.id,
                    quantity: params.quantity,
                    price: price
                }
            });

            // nyari user
            const user = await prisma.user.findUnique({
                where: {
                    id: +params.user_id
                }
            });

            if (!user) {
                throw { name: 'notFound', message: 'User Not Found' };
            }

            // Inputan buat raja ongkir
            const warehouseId = product.Product_Warehouses[0].warehouse_id;
            const originId = product.Product_Warehouses[0].warehouse.city.id;
            const destinationId = user.city_id;

            const shippingCostUrl = `${process.env.API_URL_RAJA_ONGKIR}/cost`;

            // fetch data api raja ongkir
            const getShippingCost = async () => {
                try {
                    const response = await axios.post(
                        shippingCostUrl,
                        new URLSearchParams({
                            origin: `${originId}`,
                            destination: `${destinationId}`,
                            weight: `${product.weight}`,
                            courier: params.courier
                        }),
                        {
                            headers: {
                                'key': process.env.RAJAONGKIR_SECRET_KEY,
                                'content-type': 'application/x-www-form-urlencoded'
                            }
                        }
                    );

                    return response.data;
                } catch (error) {
                    console.error('Error dimana lagi ini anjoyyyy', error.message);
                    throw error;
                }
            };

            const shippingData = await getShippingCost();

            // ambil harganya aja
            const shippingCost = shippingData.rajaongkir.results[0].costs[0].cost[0].value;

            const netPrice = price + shippingCost;

            // Update cart dengan informasi baru
            const updatedCart = await prisma.cart.update({
                where: findOneParams,
                data: {
                    warehouse_id: warehouseId,
                    shipping_cost: shippingCost,
                    total_price: price,
                    net_price: netPrice,
                    courier: params.courier,
                    shipping_method: params.shippingMethod
                }
            });

            return updatedCart;
        });

        return updatedCart;
};




const reset = async (params) => {
    const { user_id } = params;

    if (!user_id) throw { name: 'invalidInput', message: 'User ID input required' }

    const data = await prisma.cart.findUnique({
        where: {
            id: user_id
        }, include: { cart_items: true }
    });

    if (!data) throw { name: 'notFound', name: 'Cart Not Found' }


};

//soft delete
const deleteProduct = (params) => { };

module.exports = { findOne, update, reset, deleteProduct };
