const prisma = require('../lib/prisma');

const findOne = async (params) => {
    const data = await prisma.warehouse.findFirst({
        where: params,
        include: {city: true}
    });

    if (!data) throw { name: 'notFound', message: 'Warehouse Not Found' }

    return data;
};

const findAll = async (params = {}) => {

    const data = await prisma.warehouse.findMany({
        where: params
    });

    if (!data) throw { name: 'notFound', message: 'Failed to Get Warehouse Data' }

    return data;
};

const create = async (params) => {
    const { name, city_id, province_id, address, zipCode } = params;

    const city = await prisma.city.findUnique({
        where: {
            id: +city_id
        }
    });

    if (!city) throw { name: 'notFound', message: 'City Not Found' }

    const province = await prisma.province.findUnique({
        where: {
            id: +province_id
        }
    });

    if (!province) throw { name: 'notFound', message: 'Province Not Found' }

    const data = await prisma.warehouse.create({
        data: {
            name: name,
            cityId: city.id,
            province_id: province.id,
            address: address,
            zipCode: zipCode,
            status: 'active'
        }
    });

    return data;
}

//perlu di ubah
const update = async (params) => {
    const { id, name, city_id, province_id, address, zipCode } = params;

    const warehouse = await findOne({id: +id});

    if (!warehouse) throw { name: 'notFound', message: 'Warehouse Not Found' }

    const data = await prisma.warehouse.update({
        where: {
            id: +warehouse.id
        }, data: {
            name: name,
            cityId: city_id,
            province_id: province_id,
            address: address,
            zipCode: zipCode
        }
    });

    return data;
}

const destroy = async (params) => {

    const warehouse = await findOne(params);

    if (!warehouse) throw { name: 'notFound', message: 'Warehouse to Delete Not Found' }

    const data = await prisma.warehouse.update({
        where: {
            id: warehouse.id
        },
        data: {
            status: 'inactive'
        }
    });

    if (!data) throw { name: 'failedToDelete', message: 'Failed to Delete Warehouse' }
}

const activatedWarehouse = async (params) => {
    const warehouse = await findOne(params);

    if (!warehouse) throw { name: 'notFound', message: 'Warehouse to Activated Not Found' }

    const data = await prisma.warehouse.update({
        where: {
            id: warehouse.id
        }, data: {
            status: 'active'
        }
    });

    if (!data) throw { name: 'faileToActivated', message: 'Failed to Activated Warehouse' }
}

module.exports = { findOne, findAll, create, update, destroy, activatedWarehouse };