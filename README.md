# Seller Products Monorepo

Sistem manajemen produk sederhana (Dashboard Penjual) yang terdiri dari Frontend React dan Backend Express.

## 📂 Struktur Folder

- **`be`** (Backend Utama): Node.js, Express, MySQL, Sequelize. Berjalan di port `5000`.
- **`seller_products`** (Frontend Utama): React, Vite, Ant Design, Bulma. Berjalan di port `5173`.

## 🚀 Prasyarat

- **Node.js** terinstall.
- **MySQL** terinstall dan berjalan (via XAMPP atau service).

## 🛠️ Instalasi & Setup

### 1. Setup Backend

```bash
cd be
npm install
```

### 2. Setup Database

Pastikan Anda sudah membuat database kosong bernama `upload_db` di MySQL Anda.

```bash
# Contoh command line (jika ada mysql di path)
mysql -u root -e "CREATE DATABASE upload_db;"
```

_Atau buat manual via phpMyAdmin._

### 3. Setup Frontend

```bash
cd ../seller_products
npm install
```

## ⚡ Cara Menjalankan

Anda perlu menjalankan Backend dan Frontend di **dua terminal berbeda**.

### Terminal 1: Jalankan Backend & Seeder

```bash
cd be

# (Opsional) Isi data dummy pertama kali
npm run seed

# Jalankan Server
npm start
```

_Server akan berjalan di `http://localhost:5000`_

### Terminal 2: Jalankan Frontend

```bash
cd seller_products
npm run dev
```

_Aplikasi bisa diakses di `http://localhost:5173`_

## 🔑 Informasi Login (Simulasi)

Sistem ini menggunakan autentikasi sederhana (client-side):

- **Username**: `user`
- **Password**: `pass`

## 📝 Catatan Tambahan

- Folder `backend` (SQLite) dibiarkan sebagai referensi legacy dan tidak perlu dijalankan.
- Backend (`be`) akan otomatis membuat tabel (`product`) saat dijalankan pertama kali berkat fitur `sync` dari Sequelize.
