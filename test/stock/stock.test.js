const request = require('supertest');
const { app, server } = require('../../src/server');
const { userAdmin, createUserTest, deleteUser } = require('../test.utils');
const prisma = require('../../src/lib/prisma');

let adminToken;
let userToken;
let id;


beforeAll(async () => {
    adminToken = await userAdmin();
    userToken = await createUserTest();
});

afterAll(async () => {
    await deleteUser();
    if (id !== undefined) {
        await prisma.product_Warehouse.delete({
            where: {
                id: id
            }
        });
    };
    await prisma.$disconnect();
    server.close();
});


describe('STOCK API', () => {
    it('should add stock if product not existed in warehouse', async () => {
        const mockData = {
            product_id: 1,
            warehouse_id: 4,
            stock: 200
        }

        const response = await request(app)
            .post('/v1/api/cms/stocks')
            .send(mockData)
            .set(`Authorization`, `Bearer ${adminToken}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Adding stock success');
        expect(response.body.data).toMatchObject({
            id: expect.any(Number),
            product_id: expect.any(Number),
            warehouse_id: expect.any(Number),
            stock: expect.any(Number),
            created_at: expect.any(String),
            updated_at: expect.any(String)
        });

        id = response.body.data.id
    });

    it('should throw error if product already exist in warehouse when adding stock', async () => {
        const mockData = {
            product_id: 1,
            warehouse_id: 1,
            stock: 200
        }

        const response = await request(app)
            .post('/v1/api/cms/stocks')
            .send(mockData)
            .set(`Authorization`, `Bearer ${adminToken}`)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Product already exist, you can update product stock');
    });

    it('should update stock product', async () => {
        const mockData = {
            product_id: 1,
            warehouse_id: 1
        };

        const response = await request(app)
            .put(`/v1/api/cms/stocks/${1}`)
            .send(mockData)
            .set(`Authorization`, `Bearer ${adminToken}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Update Stock Success');
        expect(response.body.data).toMatchObject({
            id: expect.any(Number),
            product_id: expect.any(Number),
            warehouse_id: expect.any(Number),
            stock: expect.any(Number),
            created_at: expect.any(String),
            updated_at: expect.any(String)
        })
    });

    it('should throw error when product to update not found', async () => {
        const mockData = {
            product_id: 12345,
            warehouse_id: 1
        };

        const response = await request(app)
            .put(`/v1/api/cms/stocks/${12345}`)
            .send(mockData)
            .set(`Authorization`, `Bearer ${adminToken}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Error not found');
    });

    it('should get stock product', async () => {
        const response = await request(app)
            .get(`/v1/api/cms/stocks/${1}`)
            .send({
                product_id: 1
            })
            .set(`Authorization`, `Bearer ${adminToken}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get Stock Success');
        expect(response.body.data).toMatchObject({
            id: expect.any(Number),
            product_id: expect.any(Number),
            warehouse_id: expect.any(Number),
            stock: expect.any(Number),
            created_at: expect.any(String),
            updated_at: expect.any(String)
        });
    });
});