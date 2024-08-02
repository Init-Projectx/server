const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (userEmail) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: "Your Order has been Processed",
            text: `Dear Customer,\n\nThank you for your purchase! We are pleased to inform you that your payment has been successfull and your order is now being processed. In the meantime, if you have any questions or need further assistance, feel free to contact our customer support.\n\nBest Regards,\nMini Miracle`
        };

        let info = await transporter.sendMail(mailOptions);

        console.log(`Email sent: ${info.messageId}`);
        console.log("Email sent successfully");
        return info.messageId;
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};

module.exports = { sendEmail };