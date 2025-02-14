const prisma = require('../lib/prisma');
const productService = require("./productService");

const findOne = async (params) => {

    const id = params;

    const data = await prisma.category.findFirst({
        where: {
            id: +id
        }
    });
 
    if(!data) throw { name: 'notFound', message: 'Category Data Not Found' }

    return data;

};

const findAll = async () => {
    const data = await prisma.category.findMany();
    
    if(!data) throw { name: 'notFound', message: 'Failed to Get Category Data' }

    return data;

};

module.exports = { findOne, findAll };

