const prisma = require("../lib/prisma");
const snap = require('../lib/midtrans');

const createOrder = async (params) => {
    const { userId, warehouseId, shippingCost, totalPrice, netPrice, shippingMethod, courier } = params;

    // Buat order di database
    const order = await prisma.orders.create({
        data: {
            user_id: userId,
            warehouse_id: warehouseId,
            shipping_cost: shippingCost,
            total_price: totalPrice,
            net_price: netPrice,
            shipping_method: shippingMethod,
            courier: courier,
            status: 'pending',
        }
    });

    // Panggil API Midtrans untuk mendapatkan token pembayaran
    const transactionDetails = {
        order_id: order.id,
        gross_amount: totalPrice,
    };

    const customerDetails = {
        username : 'username',
        email: 'email@example.com',
        phone: '08111222333',
    };

    const parameter = {
        transaction_details: transactionDetails,
        customer_details: customerDetails,
    };

    const midtransToken = await snap.createTransaction(parameter);

    // Simpan data Midtrans ke order
    await prisma.orders.update({
        where: { id: order.id },
        data: {
            midtrans_data: midtransToken,
        }
    });

    return { order, midtransToken };
};

const findAll = async (params) => {
  try {
    return await prisma.orders.findMany(params);
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

const findOne = async (params) => {
  try {
    return await prisma.orders.findUnique(params);
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

const updateStatus = async (id, status) => {
  try {
    return await prisma.orders.update({
      where: { id },
      data: { status, updated_at: new Date() }
    });
  } catch (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};

const payment = async ({ orderId, paymentMethod, bankName, proofOfPayment }) => {
  try {
    const order = await prisma.orders.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new Error('Order not found');
    }

    if (paymentMethod === 'midtrans') {
      const parameter = {
        transaction_details: {
          order_id: `order-${orderId}-${Date.now()}`,
          gross_amount: order.total_price
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          email: order.user.email
        }
      };

      const midtransResponse = await coreApi.charge(parameter);
      await prisma.orders.update({
        where: { id: orderId },
        data: {
          midtrans_data: midtransResponse,
          status: 'pending',
          payment_method: 'midtrans'
        }
      });
      return midtransResponse;
    } else if (paymentMethod === 'manual') {
      const updatedOrder = await prisma.orders.update({
        where: { id: orderId },
        data: {
          payment_method: 'manual',
          bank_name: bankName,
          proof_of_payment: proofOfPayment,
          status: 'pending'
        }
      });
      return updatedOrder;
    } else {
      throw new Error('Unsupported payment method');
    }
  } catch (error) {
    throw new Error(`Error processing payment: ${error.message}`);
  }
};

const handleNotification = async (notification) => {
  try {
    const statusResponse = await coreApi.transaction.notification(notification);

    const orderId = parseInt(statusResponse.order_id.split('-')[1], 10);
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        await prisma.orders.update({
          where: { id: orderId },
          data: { status: 'challenge' }
        });
      } else if (fraudStatus === 'accept') {
        await prisma.orders.update({
          where: { id: orderId },
          data: { status: 'processed' }
        });
      }
    } else if (transactionStatus === 'settlement') {
      await prisma.orders.update({
        where: { id: orderId },
        data: { status: 'processed' }
      });
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      await prisma.orders.update({
        where: { id: orderId },
        data: { status: 'cancelled' }
      });
    } else if (transactionStatus === 'pending') {
      await prisma.orders.update({
        where: { id: orderId },
        data: { status: 'pending' }
      });
    }
  } catch (error) {
    throw new Error(`Error handling notification: ${error.message}`);
  }
};

module.exports = { createOrder, findAll, findOne, updateStatus, payment, handleNotification };
