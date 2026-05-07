import Product from '../models/ProductModel.js';

/**
 * Service layer untuk operasi bisnis terkait Product.
 * Memisahkan business logic dari controller (request handler).
 */

/**
 * Mengambil semua produk dengan pagination.
 * @param {number} page - Nomor halaman (1-indexed)
 * @param {number} limit - Jumlah item per halaman
 * @returns {Promise<{total: number, data: Array, page: number, totalPages: number}>}
 */
export const getAllProducts = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Product.findAndCountAll({
        offset,
        limit,
        order: [['createdAt', 'DESC']],
    });
    return {
        total: count,
        data: rows,
        page,
        totalPages: Math.ceil(count / limit),
    };
};

/**
 * Mengambil satu produk berdasarkan ID.
 * @param {number} id
 * @returns {Promise<object|null>}
 */
export const getProductById = async (id) => {
    return await Product.findOne({ where: { id } });
};

/**
 * Menyimpan produk baru ke database.
 * @param {{name: string, image: string, url: string}} data
 * @returns {Promise<object>}
 */
export const createProduct = async ({ name, image, url }) => {
    return await Product.create({ name, image, url });
};

/**
 * Mengupdate produk berdasarkan ID.
 * @param {number} id
 * @param {{name: string}} data
 * @returns {Promise<[number]>} Jumlah row yang terupdate
 */
export const updateProductById = async (id, { name }) => {
    return await Product.update({ name }, { where: { id } });
};

/**
 * Menghapus produk berdasarkan ID.
 * @param {number} id
 * @returns {Promise<number>} Jumlah row yang terhapus
 */
export const deleteProductById = async (id) => {
    return await Product.destroy({ where: { id } });
};
