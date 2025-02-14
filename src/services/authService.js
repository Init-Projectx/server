const prisma = require('../lib/prisma');
const { hashPassword, comparePassword } = require('../lib/bcrypt');
const { generateToken } = require('../lib/jwt');

//login register perlu di handle error seperti null dsb

const register = async (params) => {
    const { username, email, password } = params;

    if (username === "" || email === "" || password === "") throw { name: 'invalidInput', message: 'Invalid Input' }

    if (password.length <= 7) throw { name: 'invalidInput', message: 'Password To Short, minimum length is 7 character' }

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


    const accessToken = generateToken({
        id: data.id,
        email: data.email,
        role: data.role
    });

    return accessToken;
}


const login = async (params) => {
    const { email, password, role } = params;

    if (email === null || password === null) throw { name: 'invalidInput', message: 'invalid Input' }

    const foundUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!foundUser) throw { name: 'invalidCredentials', message: 'Account not found' }

    const matchPassword = await comparePassword(password, foundUser.password);

    if (!matchPassword) throw { name: 'invalidCredentials', message: 'Invalid Credentials' }

    if (role && foundUser.role !== 'admin') {
        throw { name: 'invalidCredentials', message: 'You dont have authorization' }
    }

    const accessToken = generateToken({
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role
    });

    return accessToken;

}

module.exports = { register, login }