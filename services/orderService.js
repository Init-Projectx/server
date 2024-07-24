const prisma = require("../lib/prisma");
const dotenv = require('dotenv')
const midtrans = require('midtrans-client');

dotenv.config();


const findAll = async (params = {}) => {

  const data = await prisma.orders.findMany({
    where: params,
    include: {
      order_products: {
        include: { product: true }
      }
    }
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
  const { address, paymentMethod, proofOfPayment, bankName, warehouse_id, shipping_cost, shipping_method, courier, order_items_attributes, user_id } = params;

  if (!address || address === null) throw { name: 'invalidInput', message: 'Address Required' }

  if (order_items_attributes.quantity >= 0) throw { name: 'invalidInput', message: 'Invalid input quantity' }

  return await prisma.$transaction(async (prisma) => {
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: order_items_attributes.map(item => item.product_id),
        },
      },
      select: {
        id: true,
        price: true,
        weight: true,
      },
    });

    let total_price = 0;
    let total_weight = 0;

    for (const item of order_items_attributes) {
      const product = products.find(p => p.id === item.product_id);

      if (!product) {
        throw { name: 'notFound', message: 'Product not found' };
      }

      total_price += product.price * item.quantity;
      total_weight += product.weight * item.quantity;

      const productStock = await prisma.product_Warehouse.findFirst({
        where: {
          product_id: +item.product_id,
          warehouse_id,
        },
      });

      if (!productStock) throw { name: 'notFound', message: 'Stock Product Not Found' }

      if (productStock.stock < item.quantity) {
        throw { name: 'invalidInput', message: 'Stock not enough' }
      }
    }

    const net_price = total_price + shipping_cost;

    const newOrder = await prisma.orders.create({
      data: {
        user_id: user_id,
        address: address,
        warehouse_id: warehouse_id,
        shipping_cost: shipping_cost,
        payment_method: paymentMethod,
        bank_name: bankName,
        proof_of_payment: proofOfPayment,
        shipping_method: shipping_method,
        courier: courier,
        status: 'pending',
      }, include: { order_products: true }
    });

    const orderProducts = order_items_attributes.map((item) => ({
      product_id: item.product_id,
      order_id: newOrder.id,
      quantity: item.quantity,
      price: products.find(p => p.id === item.product_id).price,
    }));

    const productOrder = await prisma.order_products.createMany({
      data: orderProducts,
    });

    for (const item of order_items_attributes) {
      const productWarehouse = await prisma.product_Warehouse.updateMany({
        where: {
          product_id: item.product_id,
          warehouse_id,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const updatedOrder = await prisma.orders.update({
      where: {
        id: newOrder.id
      }, data: {
        total_price: total_price,
        total_weight: total_weight,
        net_price: net_price
      }, include: { order_products: true }
    });

    return updatedOrder;
  });
};

const updateStatus = async (params) => {
  if (!params.id) throw { name: 'invalidInput', message: 'Params order id required' }

  const existingOrder = await prisma.orders.findUnique({
    where: {
      id: +params.id
    }
  });

  if (!existingOrder) throw { name: 'notFound', message: 'Order Not Found' }

  const data = await prisma.orders.update({
    where: {
      id: +params.id
    }, data: params.status
  });

  if (!data) throw { name: 'notFound', message: 'Order not found' };

  return data;
};

const payment = async (params) => {
  const { orderId, user } = params;

  const generateOrderId = orderId;

  const order = await prisma.orders.findUnique({
    where: {
      id: +orderId
    },
    include: { order_products: true }
  });

  if (!order) {
    throw { name: 'notFound', message: 'Order Not Found' };
  }

  // if (user.role === 'user' && user.id !== order.user_id) {
  //   throw { name: 'Unauthorized', message: 'You dont have authorization' };
  // }

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

const midtransPayment = async (data) => {
  if (!data.order_id || !data.transaction_status) {
    throw new Error('Invalid data received from Midtrans');
  }

  let newStatus = 'pending';
  let proofOfPayment = null;

  if (data.transaction_status === 'settlement') {
    newStatus = 'processed';
    proofOfPayment = 'payment success';
  } else if (data.transaction_status === 'deny') {
    newStatus = 'cancelled';
    proofOfPayment = 'payment failed';
  } else if (data.transaction_status === 'pending') {
    newStatus = 'pending';
    proofOfPayment = 'waiting payment';
  }

  const order = await prisma.orders.update({
    where: { id: +data.order_id },
    data: {
      midtrans_data: data,
      status: newStatus,
      proof_of_payment: proofOfPayment,
    },
  });

  return order;
};

const handleNotification = async (notification) => { };

module.exports = { createOrder, findAll, findOne, updateStatus, payment, handleNotification, midtransPayment };
