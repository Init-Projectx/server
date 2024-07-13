const prisma = require('../lib/prisma');

const findOne = async (params) => {

    const id = params;

    const data = await prisma.province.findUnique({
        where: {
            id: +id
        }
    });

    if (!data) throw { name: 'notFound', message: 'Province Data Not Found' }

    return data;
};

const findAll = async () => {
    const data = await prisma.province.findMany();

    if (!data) throw { name: 'notFound', message: 'Failed to Get Province Data' }

    return data;
};

module.exports = { findOne, findAll };