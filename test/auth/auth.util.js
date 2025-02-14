const prisma = require('../../src/lib/prisma');

const authTestUtils = async () => {
    try {
        return await prisma.user.delete({
            where: {
                email: "test@mail.com"
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = authTestUtils;