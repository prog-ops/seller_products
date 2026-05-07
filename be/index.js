import express from 'express';
import FileUpload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import ProductRoute from './routes/ProductRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import errorHandler from './middlewares/errorHandler.js';
import db from './config/Database.js';
// Import models agar Sequelize mendaftarkan semua tabel saat db.sync()
import './models/ProductModel.js';
import './models/UserModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting untuk auth routes (anti brute-force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
});
app.use('/auth', authLimiter);

// CORS — hanya izinkan frontend origin
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// Body parsing & file upload
app.use(express.json());
app.use(FileUpload({ createParentPath: true }));
app.use(express.static('public'));

// Routes
app.use(AuthRoute);
app.use(ProductRoute);

// Global error handler (harus di paling bawah)
app.use(errorHandler);

// Sync database & start server
(async () => {
    try {
        await db.authenticate();
        console.log('Database connected.');
        await db.sync();
        console.log('Models synchronized.');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();
