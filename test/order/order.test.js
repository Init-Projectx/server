const request = require('supertest');
const { app, server } = require('../../src/server');
const prisma = require('../../src/lib/prisma');
const { createUserTest, deleteUser } = require('../test.utils');

let token;
let orderId;

beforeAll(async () => {
    token = await createUserTest();
});

afterAll(async () => {
    await deleteUser();
    await prisma.$disconnect();
    server.close();
});

describe('ORDER API', () => {
    it('should create new order', async () => {
        const mockData = {
            "address": {
                "address": "Jl. Merak No.23 Surabaya",
                "city_id": 11
            },
            "paymentMethod": "Virtual Account",
            "proofOfPayment": "Waiting Payment",
            "bankName": "BCA",
            "warehouse_id": 1,
            "shipping_cost": 10000,
            "shipping_method": "reguler",
            "courier": "jne",
            "order_items_attributes": [
                {
                    "product_id": 1,
                    "quantity": 1
                },
                {
                    "product_id": 6,
                    "quantity": 1
                }
            ]
        }

        const response = await request(app)
            .post('/v1/api/orders')
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Create order success");
    });

    it('should throw error when addres is null', async () => {
        const mockData = {
            "address": null,
            "paymentMethod": "Virtual Account",
            "proofOfPayment": "Waiting Payment",
            "bankName": "BCA",
            "warehouse_id": 1,
            "shipping_cost": 10000,
            "shipping_method": "reguler",
            "courier": "jne",
            "order_items_attributes": [
                {
                    "product_id": 1,
                    "quantity": 1
                },
                {
                    "product_id": 6,
                    "quantity": 1
                }
            ]
        }

        const response = await request(app)
            .post('/v1/api/orders')
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Address Required");
    });

    it('should throw error when invalid quantity', async () => {
        const mockData = {
            "address": {
                "address": "Jl. Merak No.23 Surabaya",
                "city_id": 11
            },
            "paymentMethod": "Virtual Account",
            "proofOfPayment": "Waiting Payment",
            "bankName": "BCA",
            "warehouse_id": 1,
            "shipping_cost": 10000,
            "shipping_method": "reguler",
            "courier": "jne",
            "order_items_attributes": [
                {
                    "product_id": 1,
                    "quantity": -1
                }
            ]
        }

        const response = await request(app)
            .post('/v1/api/orders')
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid input quantity");
    });

    it('should throw error when product id is invalid', async () => {
        const mockData = {
            "address": {
                "address": "Jl. Merak No.23 Surabaya",
                "city_id": 11
            },
            "paymentMethod": "Virtual Account",
            "proofOfPayment": "Waiting Payment",
            "bankName": "BCA",
            "warehouse_id": 1,
            "shipping_cost": 10000,
            "shipping_method": "reguler",
            "courier": "jne",
            "order_items_attributes": [
                {
                    "product_id": 12345678,
                    "quantity": 2
                }
            ]
        }

        const response = await request(app)
            .post('/v1/api/orders')
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Product not found");
    });

    it('should throw error when product in warehouse not found', async () => {
        const mockData = {
            "address": {
                "address": "Jl. Merak No.23 Surabaya",
                "city_id": 11
            },
            "paymentMethod": "Virtual Account",
            "proofOfPayment": "Waiting Payment",
            "bankName": "BCA",
            "warehouse_id": 1,
            "shipping_cost": 10000,
            "shipping_method": "reguler",
            "courier": "jne",
            "order_items_attributes": [
                {
                    "product_id": 2,
                    "quantity": 1
                },
                {
                    "product_id": 3,
                    "quantity": 2
                }
            ]
        }

        const response = await request(app)
            .post('/v1/api/orders')
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Stock Product Not Found");
    });

    it('should get all order', async () => {
        const response = await request(app)
            .get(`/v1/api/orders`)
            .set("Authorization", `Bearer ${token}`)

        orderId = response.body.data[0].id
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Get data orders success");
    });

    it('should get order by id', async () => {
        const response = await request(app)
            .get(`/v1/api/orders/${orderId}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Get orders data success");
    });

    it('should throw error when id is invalid', async () => {
        const response = await request(app)
            .get(`/v1/api/orders/${12345}`)
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Orders Not Found");
    });

    it('should update order status', async () => {
        const response = await request(app)
            .put(`/v1/api/orders/${orderId}`)
            .set("Authorization", `Bearer ${token}`)
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Update status success");
    });

    it('should throw error when update order status id is invalid', async () => {
        const response = await request(app)
            .put(`/v1/api/orders/${12345}`)
            .set("Authorization", `Bearer ${token}`)
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Order Not Found");
    });
});

