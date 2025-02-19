const request = require('supertest');
const { app, server } = require('../../src/server');
const { deleteUser, userAdmin, createUserTest } = require('../test.utils');
const prisma = require('../../src/lib/prisma');

let admin;
let user;
let slug;

beforeAll(async () => {
    admin = await userAdmin();
    user = await createUserTest();
});

afterAll(async () => {
    await deleteUser();
    await prisma.$disconnect();
    server.close();
});

describe('PRODUCT API CMS', () => {
    it('should get all product', async () => {
        const response = await request(app)
            .get('/v1/api/cms/products/')
            .set(`Authorization`, `Bearer ${admin}`)

        slug = response.body.data[0].slug;
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'success get all data');
    });

    it('should throw error when user isnt admin', async () => {
        const response = await request(app)
            .get('/v1/api/cms/products/')
            .set(`Authorization`, `Bearer ${user}`)

        expect(response.status).toBe(403);
    });

    it('should get one product by slug', async () => {
        const response = await request(app)
            .get(`/v1/api/cms/products/${slug}`)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'success get one data');
    });

    it('should get product by category', async () => {
        const response = await request(app)
            .get(`/v1/api/cms/products/category/${1}`)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'success get data from category');
    });

    it('should throw error when get product by category not found', async () => {
        const response = await request(app)
            .get(`/v1/api/cms/products/category/${18}`)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Failed to get data products by category');
    });

    it('should create new product', async () => {
        const mockData = {
            name: "test product",
            description: "test",
            price: 12345,
            weight: 123,
            sku: "advadsb-w213t-asvd",
            category_id: 1,
        }

        const response = await request(app)
            .post(`/v1/api/cms/products`)
            .send(mockData)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'create product success');

        slug = response.body.data.slug;
    });

    it('should update product', async () => {
        const mockData = {
            price: 300000
        }

        const response = await request(app)
            .put(`/v1/api/cms/products/${slug}`)
            .send(mockData)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'update product success');
    });

    it('should throw error when product slug not found in update product', async () => {
        const mockData = {
            name: "testUpdate"
        }

        const response = await request(app)
            .put(`/v1/api/cms/products/${'testerror'}`)
            .send(mockData)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');
    });

    it('should deactive product status', async () => {
        const response = await request(app)
            .put(`/v1/api/cms/products/delete/${slug}`)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'delete product success');
    });

    it('should throw error when product slug is invalid in delete product', async () => {
        const response = await request(app)
            .put(`/v1/api/cms/products/delete/${123}`)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');
    });

    it('should activated product status', async () => {
        const response = await request(app)
            .put(`/v1/api/cms/products/activated/${slug}`)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'return product success');
    });

    it('should throw error when product slug is invalid in delete product', async () => {
        const response = await request(app)
            .put(`/v1/api/cms/products/activated/${123}`)
            .set(`Authorization`, `Bearer ${admin}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');

        await prisma.product.delete({
            where: {
                slug: slug
            }
        });
    });
});