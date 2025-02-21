const request = require('supertest');
const { app, server } = require('../../src/server');
const { userAdmin, deleteUser } = require('../test.utils');
const prisma = require('../../src/lib/prisma');

let token;
let warehouseId;

beforeAll(async () => {
    token = await userAdmin();
});

afterAll(async () => {
    await deleteUser();
    if (warehouseId) {
        await prisma.warehouse.delete({
            where: {
                id: warehouseId
            }
        });
    };
    await prisma.$disconnect();
    server.close();
});

describe('WAREHOUSE API', () => {
    it('should get warehouse by id', async () => {
        const response = await request(app)
            .get(`/v1/api/cms/warehouses/${1}`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get Data Warehouse Success');
        expect(response.body.data).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            cityId: expect.any(Number),
            province_id: expect.any(Number),
            address: expect.any(String),
            zipCode: expect.any(Number),
            status: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            city: {
                id: expect.any(Number),
                province_id: expect.any(Number),
                name: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String)
            }
        })
    });

    it('should throw error when warehouse not found', async () => {
        const response = await request(app)
            .get(`/v1/api/cms/warehouses/${12345}`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Warehouse Not Found');
    });

    it('should get all warehouse', async () => {
        const response = await request(app)
            .get(`/v1/api/cms/warehouses`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get Data Warehouse Success');
        response.body.data.forEach(items => {
            expect(items).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                cityId: expect.any(Number),
                province_id: expect.any(Number),
                address: expect.any(String),
                zipCode: expect.any(Number),
                status: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String)
            });
        });
    });

    it('should create new warehouse', async () => {
        const mockData = {
            name: "warehousetest",
            city_id: 1,
            province_id: 1,
            address: "Jl. Panglima Sudirman",
            zipCode: 123
        }

        const response = await request(app)
            .post('/v1/api/cms/warehouses')
            .send(mockData)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Create Warehouse Success');
        expect(response.body.data).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            cityId: expect.any(Number),
            province_id: expect.any(Number),
            address: expect.any(String),
            zipCode: expect.any(Number),
            status: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String)
        });

        warehouseId = response.body.data.id;
    });

    it('should throw error when city in create warehouse not found', async () => {
        const mockData = {
            name: "warehousetest",
            city_id: 12345,
            province_id: 1,
            address: "Jl. Panglima Sudirman",
            zipCode: 123
        }

        const response = await request(app)
            .post(`/v1/api/cms/warehouses`)
            .send(mockData)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'City Not Found');
    });

    it('should throw error when province in create warehouse not found', async () => {
        const mockData = {
            name: "warehousetest",
            city_id: 1,
            province_id: 12345,
            address: "Jl. Panglima Sudirman",
            zipCode: 123
        }

        const response = await request(app)
            .post(`/v1/api/cms/warehouses`)
            .send(mockData)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Province Not Found');
    });

    it('should update warehouse', async () => {
        const mockData = {
            name: "warehouse test update",
        }

        const response = await request(app)
            .put(`/v1/api/cms/warehouses/${warehouseId}`)
            .send(mockData)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Update Warehouse Success');
        expect(response.body.data.name).toBe(mockData.name);
    });

    it('should throw error when warehouse in update warehouse not found', async () => {
        const mockData = {
            name: "warehouse test update",
        }

        const response = await request(app)
            .put(`/v1/api/cms/warehouses/${12345}`)
            .send(mockData)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Warehouse Not Found');
    });

    it('should deactived warehouse', async () => {
        const response = await request(app)
            .put(`/v1/api/cms/warehouses/delete/${warehouseId}`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.body).toHaveProperty('message', 'Delete Warehouse Success');
    });

    it('should throw error when warehouse in delete warehouse not found', async () => {
        const response = await request(app)
            .put(`/v1/api/cms/warehouses/delete/${12345}`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Warehouse Not Found');
    });

    it('should activated warehouse', async () => {
        const response = await request(app)
            .put(`/v1/api/cms/warehouses/activated/${warehouseId}`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Activated Warehouse Success');
    });

    it('should throw error when warehouse in activated warehouse not found', async () => {
        const response = await request(app)
            .put(`/v1/api/cms/warehouses/activated/${12345}`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Warehouse Not Found');
    });
});