const prisma = require('../lib/prisma');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const findOne = async (params) => {
    const cart = await prisma.cart.findFirst({
        where: {
            user_id: +params.user
        },
        include: {
            cart_items: {
                include: { product: true }
            }
        }
    });

    return cart;
};

const update = async (params) => {
    const { user_id, courier, shipping_method, shipping_cost, warehouse_id, cart_items_attr } = params;
    const { product_id, quantity } = cart_items_attr;

    return prisma.$transaction(async (prisma) => {
        const cart = await prisma.cart.findUnique({
            where: { user_id: Number(user_id) },
            include: { cart_items: true }
        });

        if (!cart) {
            throw { name: "notFound", message: "Cart Not Found" };
        }

        if (warehouse_id) {
            const validWarehouse = await prisma.warehouse.findUnique({
                where: { id: warehouse_id }
            });

            if (!validWarehouse) {
                throw { name: "notFound", message: "Warehouse Not Found" };
            }
        }

        if (product_id && quantity !== undefined) {
            if (quantity <= 0) {
                throw { name: "invalidInput", message: "Quantity must be greater than zero" };
            }

            const product = await prisma.product.findUnique({
                where: { id: product_id }
            });

            if (!product) {
                throw { name: "notFound", message: "Product Not Found" };
            }

            const productWarehouse = await prisma.product_Warehouse.findFirst({
                where: {
                    product_id: product_id,
                }
            });

            if (!productWarehouse) {
                throw { name: "notFound", message: "Product is not available in this warehouse" };
            }

            if (productWarehouse.stock < quantity) {
                throw { name: "invalidInput", message: "Stock is not enough" };
            }

            let cartItem = cart.cart_items.find(item => item.product_id === product_id);

            if (cartItem) {
                await prisma.cart_items.update({
                    where: { id: cartItem.id },
                    data: {
                        quantity: quantity,
                        price: product.price
                    }
                });
            } else {
                await prisma.cart_items.create({
                    data: {
                        cart_id: cart.id,
                        product_id: product_id,
                        quantity: quantity,
                        price: product.price
                    }
                });
            }
        }

        const updatedCartItems = await prisma.cart_items.findMany({
            where: { cart_id: cart.id }
        });

        const total_price = updatedCartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        const net_price = total_price + shipping_cost;

        const updatedCart = await prisma.cart.update({
            where: { id: Number(cart.id) },
            data: {
                courier: courier,
                shipping_method: shipping_method,
                shipping_cost: shipping_cost,
                warehouse_id: warehouse_id,
                total_price: total_price,
                net_price: net_price
            }, include: {
                cart_items: {
                    include: { product: true }
                }
            }
        });

        return updatedCart;
    });
};

const getShippingCost = async (params) => {

    const { origin_id, destination_id, weight, courier } = params;

    if (!origin_id || !destination_id || !weight || !courier) throw { name: 'invalidInput', message: 'Invalid Input' }

    const origin = await prisma.city.findUnique({
        where: {
            id: +origin_id
        }
    });

    if (!origin) throw { name: 'notFound', message: 'Origin not Found' }

    const destination = await prisma.city.findUnique({
        where: {
            id: +destination_id
        }
    });

    if (!destination) throw { name: 'notFound', message: 'Destination Not Found' }

    const shippingCostUrl = `${process.env.API_URL_RAJA_ONGKIR}/cost`;


    const response = await axios.post(
        shippingCostUrl,
        new URLSearchParams({
            origin: origin.id,
            destination: destination.id,
            weight: +weight,
            courier: courier
        }),
        {
            headers: {
                'key': process.env.RAJAONGKIR_SECRET_KEY,
                'content-type': 'application/x-www-form-urlencoded'
            }
        }
    );

    const result = response.data.rajaongkir.results[0].costs.map(item => item);

    return result;
}

const reset = async (params) => {

    await prisma.$transaction(async (prisma) => {
        const cart = await prisma.cart.findUnique({
            where: {
                user_id: params.user_id
            }
        });

        const cartItems = await prisma.cart_items.findMany({
            where: {
                cart_id: cart.id
            }
        });

        if (!cartItems || cartItems.length === 0) throw { name: 'notFound', message: 'Cart items to delete not found' }

        const deleteItems = await prisma.cart_items.deleteMany({
            where: {
                cart_id: cart.id
            }
        });

        const cartReset = await prisma.cart.update({
            where: {
                id: cart.id
            }, data: {
                warehouse_id: null,
                shipping_cost: null,
                total_price: null,
                net_price: null,
                shipping_method: null,
                courier: null
            }
        });
    })
};

const deleteProduct = async (params) => {
    const { user_id, product_id } = params;

    return prisma.$transaction(async (prisma) => {
        const cart = await prisma.cart.findUnique({
            where: {
                user_id: +user_id
            }
        });

        const cartItem = await prisma.cart_items.findFirst({
            where: {
                product_id: +product_id
            }
        });

        if (!cartItem) throw { name: 'notFound', message: 'Cart items not found' }

        const cartItems = await prisma.cart_items.delete({
            where: {
                id: cartItem.id
            }
        });

        const updatedCartItems = await prisma.cart_items.findMany({
            where: {
                cart_id: +cart.id
            }
        });

        if (updatedCartItems.length === 0) {
            const updatedCart = await prisma.cart.update({
                where: {
                    user_id: +user_id
                }, data: {
                    warehouse_id: null,
                    shipping_cost: null,
                    total_price: null,
                    net_price: null,
                    shipping_method: null,
                    courier: null
                }
            });
        } else {

            const updatedCart = await prisma.cart.findUnique({
                where: {
                    user_id: user_id
                }, include: {
                    cart_items: {
                        include: { product: true }
                    }
                }
            });

            const total_price = updatedCart.cart_items.reduce((total, item) => {
                return total + item.price * item.quantity;
            }, 0);

            const newCart = await prisma.cart.update({
                where: {
                    id: +cart.id
                },
                data: {
                    total_price: total_price,
                    net_price: null,
                    shipping_cost: null,
                    shipping_method: null
                }, include: {
                    cart_items: {
                        include: { product: true }
                    }
                }
            });
        }
    });
};


module.exports = { findOne, update, reset, deleteProduct, getShippingCost };
