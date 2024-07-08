const prisma = require('../lib/prisma');
const { hashPassword, comparePassword } = require('../lib/bcrypt');
const { generateToken } = require('../lib/jwt');

const register = async (params) => {
    const { username, email, password } = params;

    if (password.length <= 7) throw { name: 'passwordToShort' }

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
        if (existingUser.username === username) throw { name: 'userNameAlreadyExist' }

        if (existingUser.email === email) throw { name: 'emailAlreadyExist' }
    }

    const data = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: encryptPassword
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

    if (!foundUser) throw { name: 'invalidCredentials' }

    const matchPassword = await comparePassword(password, foundUser.password);

    if (!matchPassword) throw { name: 'invalidCredentials' }

    const accessToken = generateToken({
        id: foundUser.id,
        email: foundUser.email
    });

    return accessToken;

}

module.exports = { register, login }