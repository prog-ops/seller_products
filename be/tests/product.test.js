import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Product from '../models/ProductModel.js';

/**
 * Integration tests untuk Product API.
 * Menguji CRUD, pagination, authorization, dan validasi input.
 */

let token;

beforeAll(async () => {
    // Buat user dan ambil token untuk protected routes
    await request(app)
        .post('/auth/register')
        .send({ username: 'producttest', password: 'test1234' });
    const res = await request(app)
        .post('/auth/login')
        .send({ username: 'producttest', password: 'test1234' });
    token = res.body.data.token;

    // Seed beberapa produk langsung ke DB untuk testing read operations
    await Product.bulkCreate([
        { name: 'Produk A', image: 'a.jpg', url: 'http://localhost:5000/images/a.jpg' },
        { name: 'Produk B', image: 'b.jpg', url: 'http://localhost:5000/images/b.jpg' },
        { name: 'Produk C', image: 'c.jpg', url: 'http://localhost:5000/images/c.jpg' },
    ]);
});

// ============================================================
// GET /products — Public route, paginated listing
// ============================================================

describe('GET /products', () => {
    it('should return paginated product list with metadata', async () => {
        const res = await request(app).get('/products');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('total');
        expect(res.body.data).toHaveProperty('page');
        expect(res.body.data).toHaveProperty('totalPages');
        expect(Array.isArray(res.body.data.data)).toBe(true);
    });

    it('should return correct number of items per page', async () => {
        const res = await request(app).get('/products?page=1&limit=2');

        expect(res.status).toBe(200);
        expect(res.body.data.data.length).toBeLessThanOrEqual(2);
        expect(res.body.data.page).toBe(1);
    });

    it('should work without authentication (public route)', async () => {
        const res = await request(app).get('/products');

        expect(res.status).toBe(200);
    });
});

// ============================================================
// GET /products/:id — Public route, single product
// ============================================================

describe('GET /products/:id', () => {
    it('should return a single product by ID', async () => {
        const res = await request(app).get('/products/1');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data).toHaveProperty('url');
    });

    it('should return 404 for non-existent product', async () => {
        const res = await request(app).get('/products/9999');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

// ============================================================
// POST /products — Protected route, product creation
// ============================================================

describe('POST /products', () => {
    it('should reject request without auth token (401)', async () => {
        const res = await request(app)
            .post('/products')
            .field('title', 'Unauthorized Product');

        expect(res.status).toBe(401);
    });

    it('should reject request without file upload (400)', async () => {
        const res = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'No File Product');

        expect(res.status).toBe(400);
    });

    it('should reject empty product name (422)', async () => {
        const res = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .field('title', '');

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
    });

    it('should create a product with valid image', async () => {
        const res = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Produk Upload Test')
            .attach('file', Buffer.from('fake-jpg-content'), 'test-upload.jpg');

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('should reject non-image file type (422)', async () => {
        const res = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Bad File Type')
            .attach('file', Buffer.from('not-an-image'), 'document.pdf');

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
    });
});

// ============================================================
// PATCH /products/:id — Protected route, update product
// ============================================================

describe('PATCH /products/:id', () => {
    it('should reject without auth token (401)', async () => {
        const res = await request(app)
            .patch('/products/1')
            .send({ title: 'Hacked' });

        expect(res.status).toBe(401);
    });

    it('should update product name with valid token', async () => {
        const res = await request(app)
            .patch('/products/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Updated Name' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should return 404 for non-existent product', async () => {
        const res = await request(app)
            .patch('/products/9999')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Ghost' });

        expect(res.status).toBe(404);
    });
});

// ============================================================
// DELETE /products/:id — Protected route, delete product
// ============================================================

describe('DELETE /products/:id', () => {
    it('should reject without auth token (401)', async () => {
        const res = await request(app).delete('/products/1');

        expect(res.status).toBe(401);
    });

    it('should return 404 for non-existent product', async () => {
        const res = await request(app)
            .delete('/products/9999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
    });

    it('should delete product with valid token', async () => {
        // Create a product to delete
        const product = await Product.create({
            name: 'To Delete',
            image: 'del.jpg',
            url: 'http://localhost:5000/images/del.jpg',
        });

        const res = await request(app)
            .delete(`/products/${product.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // Verify it's actually deleted
        const check = await request(app).get(`/products/${product.id}`);
        expect(check.status).toBe(404);
    });
});
