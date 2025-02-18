const request = require('supertest');
const { app, server } = require('../../src/server');
const prisma = require('../../src/lib/prisma');
const { deleteUser, createUserTest } = require('../test.utils');

let token;
let userId;

beforeAll(async () => {
    token = await createUserTest();

    const user = await prisma.user.findUnique({
        where: {
            email: "test@mail.com"
        }
    });

    if (!user) {
        throw new Error("User not found")
    }

    userId = user.id
});

afterAll(async () => {
    await deleteUser();
    await prisma.$disconnect();
    server.close();
})

describe('CART API', () => {
    it('should find one cart by userId', async () => {
        const response = await request(app)
            .get(`/v1/api/carts/${userId}`)
            .set('Authorization', `Bearer ${token}`)

        const { id, user_id, warehouse_id, shipping_cost, total_price, net_price, shipping_method, courier, total_weight, created_at, updated_at, cart_items } = response.body.data;

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            message: "Get Cart by id Success",
            data: {
                id, user_id, warehouse_id, shipping_cost, total_price, net_price, shipping_method, courier, total_weight, created_at, updated_at, cart_items
            }
        });
    });


    it('should update cart items', async () => {
        const mockData = {
            courier: "JNT",
            shipping_method: "COD",
            shipping_cost: 12000,
            warehouse_id: 2,
            cart_items_attr: {
                product_id: 1,
                quantity: 2
            }
        }

        const response = await request(app)
            .put(`/v1/api/carts/${userId}`)
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        const { id, user_id, warehouse_id, shipping_cost, total_price, net_price, shipping_method, courier, total_weight, created_at, updated_at, cart_items } = response.body.data;

        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject({
            id, user_id, warehouse_id, shipping_cost, total_price, net_price, shipping_method, courier, total_weight, created_at, updated_at, cart_items
        })
    });

    it('should throw error if warehouse id is not valid', async () => {
        const mockData = {
            courier: "JNT",
            shipping_method: "COD",
            shipping_cost: 12000,
            warehouse_id: 47,
            cart_items_attr: {
                product_id: 1,
                quantity: 2
            }
        }

        const response = await request(app)
            .put(`/v1/api/carts/${userId}`)
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Warehouse Not Found")
    });

    it('should throw error if quantity is invalid', async () => {
        const mockData = {
            courier: "JNT",
            shipping_method: "COD",
            shipping_cost: 12000,
            warehouse_id: 1,
            cart_items_attr: {
                product_id: 1,
                quantity: 0
            }
        }

        const response = await request(app)
            .put(`/v1/api/carts/${userId}`)
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Quantity must be greater than zero")
    });


    it('should throw error if product not found', async () => {
        const mockData = {
            courier: "JNT",
            shipping_method: "COD",
            shipping_cost: 12000,
            warehouse_id: 1,
            cart_items_attr: {
                product_id: 123456,
                quantity: 1
            }
        }

        const response = await request(app)
            .put(`/v1/api/carts/${userId}`)
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Product Not Found")
    });

    it('should throw error if stock not enough', async () => {
        const mockData = {
            courier: "JNT",
            shipping_method: "COD",
            shipping_cost: 12000,
            warehouse_id: 1,
            cart_items_attr: {
                product_id: 1,
                quantity: 1234567
            }
        }

        const response = await request(app)
            .put(`/v1/api/carts/${userId}`)
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Stock is not enough")
    });

    it('should return deliver cost', async () => {
        const data = {
            origin_id: 12,
            destination_id: 14,
            weight: 350,
            courier: "jne"
        }

        const response = await request(app)
            .post(`/v1/api/carts/shipping-cost`)
            .send(data)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Get shipping cost success");
        expect(response.body).toHaveProperty("data");
    });

    it('should return error if input is invalid', async () => {
        const data = {
            origin_id: "",
            destination_id: "",
            weight: "",
            courier: ""
        }

        const response = await request(app)
            .post(`/v1/api/carts/shipping-cost`)
            .send(data)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid Input");
    });

    it('should return error if origin is invalid', async () => {
        const data = {
            origin_id: 12345,
            destination_id: 14,
            weight: 350,
            courier: "jne"
        }

        const response = await request(app)
            .post(`/v1/api/carts/shipping-cost`)
            .send(data)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Origin not Found");
    });

    it('should return error if destination is invalid', async () => {
        const data = {
            origin_id: 12,
            destination_id: 14567,
            weight: 350,
            courier: "jne"
        }

        const response = await request(app)
            .post(`/v1/api/carts/shipping-cost`)
            .send(data)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Destination Not Found");
    });

    it('should delete product in cart', async () => {
        const mockData = {
            courier: "JNT",
            shipping_method: "COD",
            shipping_cost: 12000,
            warehouse_id: 1,
            cart_items_attr: {
                product_id: 1,
                quantity: 1
            }
        }

        await request(app)
            .put(`/v1/api/carts/${userId}`)
            .send(mockData)
            .set('Authorization', `Bearer ${token}`)

        const response = await request(app)
            .delete(`/v1/api/carts/products/${1}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Delete cart items success");
    });
});