const request = require('supertest');
const { server, app } = require('../../src/server');
const prisma = require('../../src/lib/prisma');
const { createUserTest, deleteUser } = require('../test.utils');

let token;

beforeAll(async () => {
    token = await createUserTest();
});

afterAll(async () => {
    await deleteUser();
    await prisma.$disconnect();
    server.close();
});

describe('CITY API', () => {
    it('should find city by id', async () => {
        const response = await request(app)
            .get(`/v1/api/cities/${1}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Get City By Id Success");
        expect(response.body.data).toMatchObject({
            id: expect.any(Number),
            province_id: expect.any(Number),
            name: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String)
        });
    });

    it('should return error when city not found', async () => {
        const response = await request(app)
            .get(`/v1/api/cities/${12345678}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "City Data Not Found")
    });

    it('should get all cities', async () => {
        const response = await request(app)
            .get(`/v1/api/cities?page=1&pageSize=50`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Get Cities Data Success");
        expect(response.body.data.data.length).toBe(50);
        response.body.data.data.forEach(city => {
            expect(city).toMatchObject({
                id: expect.any(Number),
                province_id: expect.any(Number),
                name: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String)
            });
        });
    });

    it('should search citiy by query', async () => {
        const query = "surabaya"
        const response = await request(app)
            .get(`/v1/api/cities/search?city=${query}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200);
            response.body.forEach(city => {
                expect(city.name.toLowerCase()).toContain(query.toLowerCase());
                expect(city).toMatchObject({
                    id: expect.any(Number),
                    province_id: expect.any(Number),
                    name: expect.any(String),
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                });
            });
    });
});