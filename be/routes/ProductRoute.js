import express from 'express';
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/ProductController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateProductInput } from '../validators/productValidator.js';

const router = express.Router();

// Public route — siapa saja bisa melihat daftar produk
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Protected routes — hanya user terautentikasi
router.post('/products', authenticate, validateProductInput, saveProduct);
router.patch('/products/:id', authenticate, validateProductInput, updateProduct);
router.delete('/products/:id', authenticate, deleteProduct);

export default router;
