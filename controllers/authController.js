const authService = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);

        res.status(200).json({
            message: 'Register Success',
            data: user
        });

    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const accessToken = await authService.login(req.body);
        
        res.status(200).json({
            message: 'Login Success',
            accessToken
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { register, login }