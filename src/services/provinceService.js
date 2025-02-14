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

const searchProvince = async (params) => {
    const { query } = params;
    const data = await prisma.province.findMany({
        where: {
            name: {
                startsWith: query,
                mode: 'insensitive'
            }
        }, take: 10
    });

    return data
}

module.exports = { findOne, findAll, searchProvince };