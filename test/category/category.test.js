const request = require('supertest');
const { app, server } = require('../../src/server');
const { deleteUser, createUserTest } = require('../test.utils');
const prisma = require('../../src/lib/prisma');

let token;

beforeAll(async () => {
    token = await createUserTest();
});

afterAll(async () => {
    await deleteUser();
    await prisma.$disconnect();
    server.close();
});

describe('CATEGORY API', () => {
    it('should find one category', async () => {
        const response = await request(app)
            .get(`/v1/api/categories/${1}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Get category by id success");
        expect(response.body.data).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String)
        });
    });

    it('should get all categories', async () => {
        const response = await request(app)
            .get(`/v1/api/categories`)

        console.log(response.body.data);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Get category data success");
    });
});