//masuk ke folder prisma kemudian run node seedProvince.js untuk melakukan seeding

const axios = require('axios');
const prisma = require('../lib/prisma');

const apiKey = process.env.RAJAONGKIR_SECRET_KEY;
const apiUrl = process.env.BASE_URL;


const fetchProvince = async () => {
    try {
        const response = await axios.get(apiUrl, {
            headers: {key: apiKey}
        });

        const provinces = response.data.rajaongkir.results;

        for(const province of provinces) {
            await prisma.province.create({
                data: {
                    name: province.province
                }
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        await prisma.$disconnect();
    }
}

fetchProvince();
