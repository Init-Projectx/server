const prisma = require('../lib/prisma');
const { verifyToken } = require('../lib/jwt');

const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) throw { name: 'Unauthenticated', message: 'Access Token Required' }

        const token = authHeader.split(' ')[1];

        if (!token) throw { name: 'Unauthenticated', message: 'Access Token Required' }

        const decoded = verifyToken(token);

        if (!decoded) throw { name: 'invalidCredentials', message: 'Invalid Credentials' }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user) throw { name: 'invalidCredentials', message: 'Invalid Credentials' }

        req.loggedUser = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        next(error);
    }
};

const authorization = (req, res, next) => {
    try {
        const superUser = req.loggedUser.role;

        if (superUser == null || superUser != 'admin') throw { name: 'Unauthorized', message: 'You Need Authorization' }

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = { authentication, authorization };
