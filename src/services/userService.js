const prisma = require('../lib/prisma');

const findOne = async (params) => {
    const id = params;
    const data = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if (!data) throw { name: 'notFound', message: 'User Data Not Found' }

    return data;
};

//untuk semua form update user di frontend harus diberikan required kecuali photo
const update = async (params, file) => {
    const { id, username, phoneNumber, city_id, province_id, zipCode, address } = params;

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if (!user) throw { name: 'notFound', message: 'User Not Found' }

    if (user.username === username) throw { name: 'exist', message: 'Username Already Exist' }

    let photoUrl = user.photo;

    if (file) {
        const photo = file.filename;
        photoUrl = `http://localhost:8080/assets/profile/picture/${photo}`;
    }

    const provinceData = await prisma.province.findFirst({
        where: {
            id: +province_id
        },
    });

    if (!provinceData) throw { name: 'notFound', message: 'Province Data Not Found' };

    const cityData = await prisma.city.findFirst({
        where: {
            id: +city_id
        }
    });

    if (!cityData) throw { name: 'notFound', message: 'City Data Not Found' }

    const data = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            username: username,
            phone_number: phoneNumber,
            address: address,
            province_id: +province_id,
            city_id: +city_id,
            zip_code: +zipCode,
            photo: photoUrl
        }
    });

    return data;
};

module.exports = { findOne, update };