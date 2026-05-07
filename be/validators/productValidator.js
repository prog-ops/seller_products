/**
 * Middleware validasi input untuk Product.
 * Menolak request lebih awal jika input tidak memenuhi syarat.
 */

/**
 * Validasi input saat membuat/mengupdate produk.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validateProductInput = (req, res, next) => {
    const title = req.body.title;
    const errors = [];

    if (!title || title.trim() === '') {
        errors.push('Nama produk wajib diisi.');
    }

    if (title && title.length > 255) {
        errors.push('Nama produk maksimal 255 karakter.');
    }

    if (errors.length > 0) {
        return res.status(422).json({
            success: false,
            message: errors.join(' '),
            data: null,
        });
    }

    next();
};
