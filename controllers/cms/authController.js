const authService = require('../../services/authService')

const login = async (req, res, next) => {
    try {
        const params = { ...req.body }
        const data = await authService.login(params);

        res.status(200).json({
            message: 'Login cms success',
            data: data
        });
    } catch (error) {
        next(error)
    }
}

module.exports = { login };