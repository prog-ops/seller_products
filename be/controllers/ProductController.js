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
