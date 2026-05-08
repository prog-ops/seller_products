import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';

/**
 * Integration tests untuk Authentication API.
 * Menguji alur register → login → token verification secara end-to-end.
 */

describe('POST /auth/register', () => {
    it('should register a new user and return 201', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'test1234' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.username).toBe('testuser');
        expect(res.body.data).not.toHaveProperty('password'); // password tidak boleh bocor
    });

    it('should reject duplicate username with 409', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'testuser', password: 'different' });

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it('should reject empty username/password with 400', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should reject short password with 422', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'shortpw', password: '12' });

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
    });
});

describe('POST /auth/login', () => {
    it('should login with correct credentials and return token', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'test1234' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.token).toMatch(/^eyJ/); // JWT always starts with eyJ
        expect(res.body.data.user.username).toBe('testuser');
    });

    it('should reject wrong password with 401', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'wrongpass' });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should reject non-existent user with 401', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'nobody', password: 'pass' });

        expect(res.status).toBe(401);
    });

    it('should reject empty body with 400', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({});

        expect(res.status).toBe(400);
    });
});

describe('GET /auth/me', () => {
    let token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'test1234' });
        token = res.body.data.token;
    });

    it('should return user data with valid token', async () => {
        const res = await request(app)
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.username).toBe('testuser');
        expect(res.body.data).not.toHaveProperty('password');
    });

    it('should reject request without token with 401', async () => {
        const res = await request(app).get('/auth/me');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should reject invalid token with 401', async () => {
        const res = await request(app)
            .get('/auth/me')
            .set('Authorization', 'Bearer this.is.not.a.valid.jwt');

        expect(res.status).toBe(401);
    });

    it('should reject malformed Authorization header with 401', async () => {
        const res = await request(app)
            .get('/auth/me')
            .set('Authorization', 'NotBearer something');

        expect(res.status).toBe(401);
    });
});
