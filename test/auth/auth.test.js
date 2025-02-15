const request = require('supertest');
const { app, server } = require('../../src/server');
const prisma = require('../../src/lib/prisma');
const deleteUser = require('../test.utils');

afterAll(async () => {
    await deleteUser();
    await prisma.$disconnect();
    server.close();
});

describe('AUTH API', () => {
    it('should create new user', async () => {
        const userData = {
            username: "test",
            email: "test@mail.com",
            password: "password"
        }

        const response = await request(app)
            .post("/v1/api/auth/register")
            .send(userData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Register Success");
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
    });

    it('should reject register user if password to short', async () => {
        const userData = {
            username: "test1",
            email: "test12@mail.com",
            password: "abc"
        }

        const response = await request(app)
            .post("/v1/api/auth/register")
            .send(userData)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Password To Short, minimum length is 7 character");
    });

    it('should reject register user if input is invalid', async () => {
        const userData = {
            username: "",
            email: "",
            password: ""
        }

        const response = await request(app)
            .post("/v1/api/auth/register")
            .send(userData)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid Input");
    });

    it('should reject register user if username already used', async () => {
        const userData = {
            username: "test",
            email: "test@mail.com",
            password: "password"
        }

        const response = await request(app)
            .post("/v1/api/auth/register")
            .send(userData)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Username Already Exist");
    });

    it('should reject register user if email already used', async () => {
        const userData = {
            username: "test1",
            email: "test@mail.com",
            password: "password"
        }

        const response = await request(app)
            .post("/v1/api/auth/register")
            .send(userData)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Email Already Exist");
    });

    it('should login user and return token', async () => {
        const userData = {
            email: "test@mail.com",
            password: "password"
        }

        const response = await request(app)
            .post("/v1/api/auth/login")
            .send(userData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Login Success");
        expect(response.body).toHaveProperty("accessToken");
        expect(typeof response.body.accessToken).toBe("string");
    });

    it('should reject user login when email is invalid', async () => {
        const userData = {
            email: "testttt@mail.com",
            password: "password"
        }

        const response = await request(app)
            .post("/v1/api/auth/login")
            .send(userData)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Account not found");
    });

    it('should reject user login when password is invalid', async () => {
        const userData = {
            email: "test@mail.com",
            password: "thisispassword"
        }

        const response = await request(app)
            .post("/v1/api/auth/login")
            .send(userData)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Invalid Credentials");
    });

    it('should reject user login into cms dashboard when role isnt admin', async () => {
        const userData = {
            email: "test@mail.com",
            password: "password"
        }

        const response = await request(app)
            .post("/v1/api/cms/auth/login")
            .send(userData)

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "You dont have authorization");
    });
});