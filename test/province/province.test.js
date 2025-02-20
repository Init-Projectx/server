const request = require('supertest');
const { app, server } = require('../../src/server');
const { createUserTest, deleteUser } = require('../test.utils');
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

describe('PROVINCE API', () => {
    it('should get all province', async () => {
        const response = await request(app)
            .get(`/v1/api/provinces`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get data province success');
        response.body.data.forEach(item => {
            expect(item).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String)
            })
        });
    });

    it('should get province by id', async () => {
        const response = await request(app)
            .get(`/v1/api/provinces/${1}`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get province by id success');
        expect(response.body.data).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String)
        })
    });

    it('should throw error when id is invalid', async () => {
        const response = await request(app)
            .get(`/v1/api/provinces/${123456789}`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Province Data Not Found');
    });

    it('should throw error when id is invalid', async () => {
        const response = await request(app)
            .get(`/v1/api/provinces/${123456789}`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Province Data Not Found');
    });

    it('should get province by query', async () => {
        const response = await request(app)
            .get(`/v1/api/provinces/search?province=jawa`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
    });
});