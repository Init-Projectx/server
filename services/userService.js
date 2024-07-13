const prisma = require('../lib/prisma');

const findOne = async (params) => {
    const id = params;
    const data = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if (!data) throw { name: 'userNotFound' }

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

    if (!user) throw { name: 'userNotFound' }

    if (user.username === username) throw { name: 'userNameAlreadyExist' }

    let photoUrl = user.photo;

    if (file) {
        const photo = file.filename;
        photoUrl = `http://localhost:8080/assets/profile/picture/${photo}`;
    }

    const provinceData = await prisma.province.findFirst({
        where: {
            id: province_id
        },
    });

    if (!provinceData) throw { name: 'provinceNotFound' };

    const cityData = await prisma.city.findFirst({
        where: {
            id: city_id
        }
    });

    if (!cityData) throw { name: 'cityNotFound' }

    const data = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            username: username,
            phone_number: phoneNumber,
            address: address,
            province_id: provinceData.id,
            city_id: cityData.id,
            zip_code: +zipCode,
            photo: photoUrl
        }
    });

    return data;
};

module.exports = { findOne, update };