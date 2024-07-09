const prisma = require('../lib/prisma');
const productService = require("./productService");

const findOne = async (params) => {

    const name = params;

    const data = await prisma.category.findFirst({
        where: {
            name: {
                mode: "insensitive", 
                equals: name
            }
        }
    });
 
    if(!data) throw { name: 'categoriesNotFound' }

    return data;

};

const findAll = async () => {
    const data = await prisma.category.findMany();
    
    if(!data) throw { name: 'failedGetCategoryData' }

    return data;

};

module.exports = { findOne, findAll };

