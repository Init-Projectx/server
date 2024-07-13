const prisma = require('../lib/prisma');

const findOne = async (params) => {
    const id = params;

    const data = await prisma.city.findUnique({
        where: {
            id: +id
        }
    });

    if (!data) throw { name: 'notFound', message: 'City Data Not Found' }

    return data;
};

const findAll = async (params) => {
    const page = parseInt(params.page) || 1;
    const pageSize = parseInt(params.pageSize) || 120;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const data = await prisma.city.findMany({
        skip: skip,
        take: take
    });

    const totalCities = await prisma.city.count();

    if (!data) throw { name: 'notFound', message: 'Failed to Get All City Data' };

    return {
        data: data,
        meta: {
            total: totalCities,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(totalCities / pageSize)
        }
    };
};


module.exports = { findOne, findAll };