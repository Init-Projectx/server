// Isi user profile
// tidak menerima user id dari request

const userService = require('../services/userService');

const findOne = async (req, res, next) => {
    try {
        const id = req.loggedUser.id;

        const data = await userService.findOne(id);

        res.status(200).json({
            message: 'Get user by id success',
            data: data
        });

    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const id = req.loggedUser.id;
        const file = req.file;
        const params = { ...req.body, id };

        const userData = await userService.update(params, file);

        res.status(200).json({
            message: 'Update User Success',
            data: userData
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { findOne, update };