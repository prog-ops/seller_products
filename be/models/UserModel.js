import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const User = db.define(
    'user',
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { notEmpty: true },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true },
        },
    },
    {
        freezeTableName: true,
        hooks: {
            /**
             * Hash password otomatis sebelum user dibuat.
             */
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    }
);

/**
 * Memverifikasi password plain-text terhadap hash yang tersimpan.
 * @param {string} plainPassword
 * @returns {Promise<boolean>}
 */
User.prototype.validatePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

export default User;
