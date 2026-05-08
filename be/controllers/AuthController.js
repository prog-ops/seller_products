import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { success, error } from '../utils/apiResponse.js';

/**
 * Register user baru.
 * POST /auth/register
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrasi user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 minLength: 4
 *                 example: "rahasia123"
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Registrasi berhasil." }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       409:
 *         description: Username sudah digunakan
 */
export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return error(res, 'Username dan password wajib diisi.', 400);
        }

        if (password.length < 4) {
            return error(res, 'Password minimal 4 karakter.', 422);
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return error(res, 'Username sudah digunakan.', 409);
        }

        const user = await User.create({ username, password });
        return success(
            res,
            { id: user.id, username: user.username },
            'Registrasi berhasil.',
            201
        );
    } catch (e) {
        return error(res, e.message);
    }
};

/**
 * Login user dan generate JWT token.
 * POST /auth/login
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login dan dapatkan JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: "johndoe" }
 *               password: { type: string, example: "rahasia123" }
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Login berhasil." }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string, example: "eyJhbGciOiJIUzI1NiIs..." }
 *                     user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Kredensial tidak valid
 */
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return error(res, 'Username dan password wajib diisi.', 400);
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return error(res, 'Username atau password salah.', 401);
        }

        const isValid = await user.validatePassword(password);
        if (!isValid) {
            return error(res, 'Username atau password salah.', 401);
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return success(res, {
            token,
            user: { id: user.id, username: user.username },
        }, 'Login berhasil.');
    } catch (e) {
        return error(res, e.message);
    }
};

/**
 * Mendapatkan data user yang sedang login (dari token).
 * GET /auth/me
 */
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Dapatkan data user yang sedang login
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Token tidak valid / tidak tersedia
 *       404:
 *         description: User tidak ditemukan
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id },
            attributes: ['id', 'username', 'createdAt'],
        });

        if (!user) {
            return error(res, 'User tidak ditemukan.', 404);
        }

        return success(res, user, 'Data user berhasil diambil.');
    } catch (e) {
        return error(res, e.message);
    }
};
