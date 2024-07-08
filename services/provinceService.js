const prisma = require('../lib/prisma');

const findOne = async (params) => {

    const id = params;

    const data = await prisma.province.findUnique({
        where: {
            id: id
        }
    });

    if (!data) throw { name: 'provinceNotFound' }

    return data;
};

const findAll = async () => {
    const data = await prisma.province.findMany();

    return data;
};

module.exports = { findOne, findAll };