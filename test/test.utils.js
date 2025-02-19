const prisma = require('../src/lib/prisma');
const { register } = require('../src/services/authService');


const deleteUser = async () => {
    try {
        await prisma.user.deleteMany({
            where: {
                OR: [
                    {
                        email: "test@mail.com"
                    }, {
                        email: "testadmin@mail.com"
                    }
                ]
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

const userAdmin = async () => {
    try {
        const data = {
            username: "testadmin",
            email: "testadmin@mail.com",
            password: "password",
            role: "admin"
        }

        const admin = await register(data);

        return admin;
    } catch (error) {
        console.log("Error create user admin", error);
    }
}

module.exports = { deleteUser, createUserTest, userAdmin };