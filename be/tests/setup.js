import db from '../config/Database.js';

/**
 * Global test setup.
 * Sinkronisasi database dengan force:true untuk mendapatkan tabel bersih
 * sebelum semua test dijalankan.
 */
beforeAll(async () => {
    await db.sync({ force: true });
});

/**
 * Tutup koneksi database setelah semua test selesai
 * agar proses tidak menggantung.
 */
afterAll(async () => {
    await db.close();
});
