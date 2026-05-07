import dotenv from 'dotenv';
dotenv.config();

import Product from './models/ProductModel.js';
import User from './models/UserModel.js';
import db from './config/Database.js';

/**
 * Seeder — mengisi database dengan data awal.
 * Jalankan: bun run seed
 */

const productSeeds = [
    {
        name: 'Sepatu Lari Keren',
        image: 'placeholder-shoe.jpg',
        url: 'https://dummyimage.com/400x300/3498db/fff.jpg&text=Sepatu+Lari',
    },
    {
        name: 'Kemeja Flannel Merah',
        image: 'placeholder-shirt.jpg',
        url: 'https://dummyimage.com/400x300/e74c3c/fff.jpg&text=Kemeja+Flannel',
    },
    {
        name: 'Tas Ransel Outdoor',
        image: 'placeholder-bag.jpg',
        url: 'https://dummyimage.com/400x300/2ecc71/fff.jpg&text=Tas+Ransel',
    },
];

const userSeeds = [
    { username: 'admin', password: 'admin123' },
];

(async () => {
    try {
        await db.authenticate();
        await db.sync({ force: true }); // Reset tables

        await Product.bulkCreate(productSeeds);
        console.log('✅ Data produk dummy berhasil ditambahkan!');

        // User.create triggers beforeCreate hook for bcrypt hashing
        for (const user of userSeeds) {
            await User.create(user);
        }
        console.log('✅ User default berhasil dibuat! (admin / admin123)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Gagal menjalankan seeder:', error);
        process.exit(1);
    }
})();
