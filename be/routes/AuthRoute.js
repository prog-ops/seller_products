import express from 'express';
import { register, login, getMe } from '../controllers/AuthController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);

export default router;
