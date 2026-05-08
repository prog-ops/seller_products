import express from 'express';
import FileUpload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import ProductRoute from './routes/ProductRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import errorHandler from './middlewares/errorHandler.js';
// Import models agar Sequelize mendaftarkan semua tabel saat db.sync()
import './models/ProductModel.js';
import './models/UserModel.js';

dotenv.config();

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting — disabled di test environment agar tidak blocking
if (process.env.NODE_ENV !== 'test') {
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 50,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
    });
    app.use('/auth', authLimiter);
}

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

// Swagger docs — hanya di development
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    try {
        const { default: swaggerUi } = await import('swagger-ui-express');
        const { default: swaggerSpec } = await import('./swagger.config.js');
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            customCss: '.swagger-ui .topbar { display: none }',
            explorer: true,
            swaggerOptions: { persistAuthorization: true },
        }));
        app.get('/swagger.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });
    } catch {
        // Swagger deps not installed — skip silently
    }
}

// Global error handler (harus di paling bawah)
app.use(errorHandler);

export default app;
