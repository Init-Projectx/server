const prisma = require('../src/lib/prisma');
const { register } = require('../src/services/authService');


const deleteUser = async () => {
    try {
        await prisma.user.delete({
            where: {
                email: "test@mail.com"
            }
        });
    } catch (error) {
        console.log("Error delete user in test", error);
    }
}

const createUserTest = async () => {
    try {
        const data = {
            username: "test",
            email: "test@mail.com",
            password: "password"
        }
        const user = await register(data);

        return user;
    } catch (error) {
        console.error("Error create user test", error);
    }
}

module.exports = { deleteUser, createUserTest };