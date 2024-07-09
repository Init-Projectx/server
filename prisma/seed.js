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

const seedCategories = async () => {
    const categories = [
        { name: 'Fashion' },
        { name: 'Food' },
        { name: 'Healthy' },
        { name: 'Toys' },
        { name: 'Feeding' },
        { name: 'Equipment' },
    ];

    try {
        for (const category of categories) {
            await prisma.category.create({
                data: {
                    name: category.name,
                   
                },
            });
        }
        console.log('Seeding categories finished.');
    } catch (error) {
        console.log(error);
    } finally {
        await prisma.$disconnect();
    }
};

seedCategories();