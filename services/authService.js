const prisma = require('../lib/prisma');
const { hashPassword, comparePassword } = require('../lib/bcrypt');
const { generateToken } = require('../lib/jwt');

const register = async (params) => {
    const { name, email, gender, password, role } = params;

    if (password.length <= 7) throw { name: 'passwordToShort' }

    const encryptPassword = await hashPassword(password);

    const data = await prisma.users.create({
        data: {
            name: name,
            email: email,
            gender: gender,
            password: encryptPassword,
            role: role
        }
    });

    return data;
}


const login = async (params) => {
    const { email, password } = params;

    const foundUser = await prisma.users.findUnique({
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