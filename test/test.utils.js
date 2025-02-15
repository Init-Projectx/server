const prisma = require('../src/lib/prisma');


const deleteUser = async () => {
    try {
        await prisma.user.delete({
            where: {
                email: "test@mail.com"
            }
        });
    } catch (error) {
        console.log("Error create user in test", error);
    }
}

module.exports = deleteUser;