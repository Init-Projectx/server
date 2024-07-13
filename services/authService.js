const prisma = require('../lib/prisma');
const { hashPassword, comparePassword } = require('../lib/bcrypt');
const { generateToken } = require('../lib/jwt');

//login register perlu di handle error seperti null dsb

const register = async (params) => {
    const { username, email, password } = params;

    if (password.length <= 7) throw { name: 'invalidInput', message: 'Password To Short' }

    const encryptPassword = await hashPassword(password);

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: email }
            ]
        }
    });

    if (existingUser) {
        if (existingUser.username === username) throw { name: 'exist', message: 'Username Already Exist' }

        if (existingUser.email === email) throw { name: 'exist', message: 'Email Already Exist' }
    }

    const data = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: encryptPassword
        }
    });


    const cart = await prisma.cart.create({
        data: {
            user_id: data.id
        }
    });

    return data;
}


const login = async (params) => {
    const { email, password } = params;

    const foundUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!foundUser) throw { name: 'invalidCredentials', message: 'Invalid Credentials' }

    const matchPassword = await comparePassword(password, foundUser.password);

    if (!matchPassword) throw { name: 'invalidCredentials', message: 'Invalid Credentials' }

    const accessToken = generateToken({
        id: foundUser.id,
        email: foundUser.email
    });

    return accessToken;

}

module.exports = { register, login }