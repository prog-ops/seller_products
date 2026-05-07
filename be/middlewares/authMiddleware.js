import jwt from 'jsonwebtoken';

/**
 * Middleware untuk memverifikasi JWT token dari header Authorization.
 * Meng-attach decoded user data ke req.user jika token valid.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak. Token tidak ditemukan.',
        });
    }

    try {
        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid atau sudah kadaluarsa.',
        });
    }
};
