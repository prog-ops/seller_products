import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { success, error } from '../utils/apiResponse.js';

/**
 * Register user baru.
 * POST /auth/register
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
