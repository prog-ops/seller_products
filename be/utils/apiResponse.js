/**
 * Utility untuk menstandarisasi format API response.
 * Semua endpoint harus menggunakan helper ini.
 */

/**
 * Mengirim response sukses.
 * @param {import('express').Response} res
 * @param {*} data - Data yang dikembalikan
 * @param {string} message - Pesan sukses
 * @param {number} statusCode - HTTP status code
 */
export const success = (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
};

/**
 * Mengirim response error.
 * @param {import('express').Response} res
 * @param {string} message - Pesan error
 * @param {number} statusCode - HTTP status code
 */
export const error = (res, message = 'Internal Server Error', statusCode = 500) => {
    return res.status(statusCode).json({ success: false, message, data: null });
};
