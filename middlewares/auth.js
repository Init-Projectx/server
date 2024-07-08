const prisma = require('../lib/prisma');
const { verifyToken } = require('../lib/jwt');

const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) throw { name: 'unauthenticated' }

        const token = authHeader.split(' ')[1];

        if (!token) throw { name: 'unauthenticated' }

        const decoded = verifyToken(token);

        if (!decoded) throw { name: 'invalidCredentials' }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });

        if (!user) throw { name: 'invalidCredentials' }

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

        if (superUser == null || superUser != 'admin') throw { name: 'unauthorized' }

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = { authentication, authorization };
