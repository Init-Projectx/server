const prisma = require("../lib/prisma");
const dotenv = require('dotenv')
const midtrans = require('midtrans-client');

dotenv.config();


const findAll = async (params = {}) => {

  const data = await prisma.orders.findMany({
    where: params,
    include: { order_products: true }
  });

  return data;
};

const findOne = async (params) => {
  if (!params) throw { name: 'invalidInput', message: 'Invalid Input' }

  const data = await prisma.orders.findUnique({
    where: {
      id: +params.id
    }, include: { order_products: true }
  });

  if (!data) throw { name: 'notFound', message: 'Orders Not Found' }

  if (params.loggedUser.role === 'user') {
    if (data.user_id !== params.loggedUser.id) throw { name: 'Unauthorized', message: 'You dont have authorization' }
  }

  return data;
};

const createOrder = async (params) => {
  const { userId, address, paymentMethod, bankName, proofOfPayment } = params;


  //data cart di kirim fe
  //

  if (!userId || !address || !paymentMethod || !bankName || !proofOfPayment) {
    throw { name: 'invalidInput', message: 'Invalid input to create order' };
  }

  const cart = await prisma.cart.findUnique({
    where: {
      user_id: +userId,
    },
    include: { cart_items: true },
  });

  if (!cart || cart.cart_items.length === 0) {
    throw { name: 'notFound', message: 'User Cart Not Found or Empty' };
  }

  for (const item of cart.cart_items) {
    const productWarehouse = await prisma.product_Warehouse.findFirst({
      where: {
        product_id: +item.product_id,
      },
    });

    if (!productWarehouse) {
      throw { name: 'notFound', message: 'Product Not Found' };
    }

    if (productWarehouse.stock < item.quantity) {
      throw { name: 'invalidInput', message: 'Stock product not enough' };
    }
  }


  //semuanya di kalkulasi ulang dan juga validasi netprice
  const totalPrice = cart.total_price;
  const warehouseId = cart.warehouse_id;
  const shippingMethod = cart.shipping_method;
  const shippingCost = cart.shipping_cost;
  const netPrice = cart.net_price;
  const courier = cart.courier;

  if (!totalPrice || !warehouseId || !shippingCost || !shippingMethod || !netPrice || !courier) {
    throw { name: 'invalidInput', message: 'Invalid Input to create order' };
  }

  const newOrder = await prisma.$transaction(async (prisma) => {
    const order = await prisma.orders.create({
      data: {
        user_id: +userId,
        address: address,
        warehouse_id: warehouseId,
        shipping_cost: shippingCost,
        payment_method: paymentMethod,
        bank_name: bankName,
        proof_of_payment: proofOfPayment,
        total_price: totalPrice,
        net_price: netPrice,
        shipping_method: shippingMethod,
        courier: courier,
        status: 'pending',
      },
    });

    const createOrderProductsPromises = cart.cart_items.map(async (item) => {
      const orderProducts = await prisma.order_products.create({
        data: {
          product_id: +item.product_id,
          order_id: order.id,
          quantity: item.quantity,
          price: item.price,
        },
      });

      if (!orderProducts) {
        throw { name: 'failedToCreate', message: 'Failed to create order products' };
      }

      const productWarehouse = await prisma.product_Warehouse.findFirst({
        where: {
          product_id: +item.product_id
        }
      });

      const updateStockWarehouse = await prisma.product_Warehouse.update({
        where: {
          id: productWarehouse.id
        },
        data: {
          stock: { decrement: 1 }
        }
      });

      if (!updateStockWarehouse) {
        throw { name: 'failedToUpdateStock', message: 'Failed to update stock' };
      }
    });

    await Promise.all(createOrderProductsPromises);

    const updatedCartItems = await prisma.cart_items.deleteMany({
      where: {
        cart_id: cart.id,
      },
    });

    return order;
  });

  return newOrder;
};

const updateStatus = async (params) => {
  const { id } = params;

  if (!id) throw { name: 'invalidInput', message: 'Params order id required' }

  const data = await prisma.orders.update({
    where: {
      id: id
    }, data: {
      status: 'processed'
    }
  });

  if (!data) throw { name: 'notFound', message: 'Order not found' };

  return data;
};

const payment = async (params) => {
  const { orderId, user } = params;

  const generateOrderId = `MNMR-${Math.floor(Math.random() * 2123351678119769)}-TRX`;

  const order = await prisma.orders.findUnique({
    where: {
      id: +orderId
    },
    include: { order_products: true }
  });

  if (!order) {
    throw { name: 'notFound', message: 'Order Not Found' };
  }

  if (user.role === 'user' && user.id !== order.user_id) {
    throw { name: 'Unauthorized', message: 'You dont have authorization' };
  }

  for (const item of order.order_products) {
    const product = await prisma.product.findUnique({
      where: {
        id: +item.product_id
      }
    });

    if (!product) {
      throw { name: 'notFound', message: 'Product Items Not Found' };
    }

    let snap = new midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    let parameter = {
      transaction_details: {
        order_id: generateOrderId,
        gross_amount: order.net_price
      }
    };

    const token = await snap.createTransactionToken(parameter);
    return token;
  }

  return null;
};


const handleNotification = async (notification) => {};

module.exports = { createOrder, findAll, findOne, updateStatus, payment, handleNotification };
