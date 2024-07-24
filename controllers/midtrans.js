const orderService = require('../services/orderService');

const midtransData = async (req, res, next) => {
    try {
        const data = { ...req.body };

        console.log('<<<<<<<<<<<<< INI PARAMS MIDTRANS', data)

        if (!data.order_id || !data.transaction_status) {
            return res.status(400).json({ message: 'Missing order_id or transaction_status' });
        }

        const updatedOrder = await orderService.midtransPayment(data);

        res.status(200).json({
            message: 'Payment data processed successfully',
            data: updatedOrder,
        });
    } catch (error) {
        console.error('Error processing payment data:', error);
        next(error);
    }
};

module.exports = midtransData;