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

describe('USER API', () => {
    it('should get logged user', async () => {
        const response = await request(app)
            .get(`/v1/api/users`)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Get user by id success');
    });

    it('should throw error when user is not logged in', async () => {
        const response = await request(app)
            .get('/v1/api/users')

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Access Token Required');
    });

    it('should update user profile', async () => {
        const mockData = {
            phoneNumber: '12345678',
            city_id: 1,
            province_id: 1,
            zipCode: 1234,
            address: "Jl. Merak"
        }

        const response = await request(app)
            .put('/v1/api/users')
            .send(mockData)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Update User Success');
    });

    it('should throw error when update user and user is not logged in', async () => {
        const mockData = {
            phoneNumber: '12345678',
            city_id: 1,
            province_id: 1,
            zipCode: 1234,
            address: "Jl. Merak"
        }

        const response = await request(app)
            .put('/v1/api/users')
            .send(mockData)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Access Token Required');
    });

    it('should throw error when updated username already existed', async () => {
        const mockData = {
            username: "test",
            phoneNumber: '12345678',
            city_id: 1,
            province_id: 1,
            zipCode: 1234,
            address: "Jl. Merak"
        }

        const response = await request(app)
            .put('/v1/api/users')
            .send(mockData)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Username Already Exist');
    });

    it('should throw error when province not found', async () => {
        const mockData = {
            phoneNumber: '12345678',
            city_id: 1,
            province_id: 123456,
            zipCode: 1234,
            address: "Jl. Merak"
        }

        const response = await request(app)
            .put('/v1/api/users')
            .send(mockData)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Province Data Not Found');
    });

    it('should throw error when city not found', async () => {
        const mockData = {
            phoneNumber: '12345678',
            city_id: 123456,
            province_id: 1,
            zipCode: 1234,
            address: "Jl. Merak"
        }

        const response = await request(app)
            .put('/v1/api/users')
            .send(mockData)
            .set(`Authorization`, `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'City Data Not Found');
    });
});