import path from 'path';
import * as ProductService from '../services/ProductService.js';
import { success, error } from '../utils/apiResponse.js';

/**
 * Mengambil semua produk dengan pagination.
 * GET /products?page=1&limit=10
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Ambil daftar produk dengan pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Jumlah item per halaman
 *     responses:
 *       200:
 *         description: Berhasil mengambil data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     totalPages: { type: integer }
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Product' }
 */
export const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await ProductService.getAllProducts(page, limit);
        return success(res, result, 'Produk berhasil diambil.');
    } catch (e) {
        return error(res, e.message);
    }
};

/**
 * Mengambil satu produk berdasarkan ID.
 * GET /products/:id
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Ambil produk berdasarkan ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Produk ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Produk tidak ditemukan
 */
export const getProductById = async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) {
            return error(res, 'Produk tidak ditemukan.', 404);
        }
        return success(res, product, 'Produk ditemukan.');
    } catch (e) {
        return error(res, e.message);
    }
};

/**
 * Menyimpan produk baru beserta gambarnya.
 * POST /products (multipart/form-data)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Tambah produk baru (dengan gambar)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, file]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nama produk
 *                 example: "Mouse Gaming"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File gambar (max 2MB, JPG/PNG)
 *     responses:
 *       201:
 *         description: Produk berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       400:
 *         description: Tidak ada file atau validasi gagal
 *       401:
 *         description: Tidak terautentikasi
 *       422:
 *         description: Tipe/ukuran file tidak valid
 */
export const saveProduct = async (req, res) => {
    if (!req.files || req.files === null) {
        return error(res, 'Tidak ada file yang diupload.', 400);
    }

    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) {
        return error(res, 'Tipe gambar tidak valid, hanya boleh JPG/JPEG dan PNG.', 422);
    }

    if (fileSize > 2_000_000) {
        return error(res, 'Ukuran gambar tidak boleh lebih dari 2 MB.', 422);
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return error(res, err.message);
        try {
            const product = await ProductService.createProduct({ name, image: fileName, url });
            return success(res, product, 'Produk berhasil ditambahkan.', 201);
        } catch (e) {
            return error(res, e.message);
        }
    });
};

/**
 * Mengupdate data produk berdasarkan ID.
 * PATCH /products/:id
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update nama produk
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Mouse Gaming Pro" }
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Produk tidak ditemukan
 */
export const updateProduct = async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) {
            return error(res, 'Produk tidak ditemukan.', 404);
        }
        await ProductService.updateProductById(req.params.id, { name: req.body.title });
        return success(res, null, 'Produk berhasil diperbarui.');
    } catch (e) {
        return error(res, e.message);
    }
};

/**
 * Menghapus produk berdasarkan ID.
 * DELETE /products/:id
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Hapus produk berdasarkan ID
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Produk tidak ditemukan
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) {
            return error(res, 'Produk tidak ditemukan.', 404);
        }
        await ProductService.deleteProductById(req.params.id);
        return success(res, null, 'Produk berhasil dihapus.');
    } catch (e) {
        return error(res, e.message);
    }
};
