/**
 * Global error handler middleware.
 * Harus didaftarkan sebagai middleware TERAKHIR di Express app.
 * Menangkap semua error yang tidak ter-handle di controller/service.
 *
 * @param {Error} err - Error object
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ${err.stack}`);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
